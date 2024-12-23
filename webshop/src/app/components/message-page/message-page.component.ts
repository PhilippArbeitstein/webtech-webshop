import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild
} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import {
    Chat,
    Message,
    MessagingService
} from '../../services/messaging.service';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-message-page',
    imports: [
        NavbarComponent,
        FooterComponent,
        CommonModule,
        RouterLink,
        FormsModule
    ],
    templateUrl: './message-page.component.html',
    styleUrls: ['./message-page.component.css']
})
export class MessagePageComponent {
    chats: { [key: string]: Chat } = {};
    selectedChat: Chat | null = null;
    chatParticipant: {
        user_id: number;
        username: string;
        email: string;
    } | null = null;
    loading = true;
    errorMessage = '';
    newMessage = '';
    private eventSource: EventSource | null = null;

    constructor(
        private messagingService: MessagingService,
        public userService: UserService,
        private routingService: RoutingService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.routingService.setPreviousRoute('messages');
        this.fetchChats();
        this.listenForLiveUpdates();
    }

    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        if (this.scrollContainer) {
            try {
                this.scrollContainer.nativeElement.scrollTop =
                    this.scrollContainer.nativeElement.scrollHeight;
            } catch (error) {
                console.error('Error scrolling to bottom:', error);
            }
        }
    }

    fetchChats(): void {
        this.messagingService.getUserChats().subscribe({
            next: (chats) => {
                this.chats = chats;
                this.loading = false;

                // Automatically select the first chat
                const firstChatKey = Object.keys(chats)[0];
                if (firstChatKey) {
                    this.selectChat(firstChatKey);
                }
            },
            error: (error) => {
                console.error('Error fetching chats:', error);
                this.errorMessage = 'Failed to load chats. Please try again.';
                this.loading = false;
            }
        });
    }

    selectChat(chatKey: string): void {
        this.selectedChat = this.chats[chatKey] || null;

        if (!this.selectedChat) {
            this.chatParticipant = null;
            return;
        }

        const isProductOwner =
            this.selectedChat.product.owner_email ===
            this.userService.loggedInUser?.email;

        if (isProductOwner) {
            const participant = this.selectedChat.participants.find(
                (p) => p.email !== this.userService.loggedInUser?.email
            );
            if (participant) {
                this.chatParticipant = {
                    user_id: participant.user_id,
                    username: participant.username,
                    email: participant.email
                };
            }
        } else {
            const ownerParticipant = this.selectedChat.participants.find(
                (p) => p.email === this.selectedChat?.product?.owner_email
            );

            this.chatParticipant = ownerParticipant
                ? {
                      user_id: ownerParticipant.user_id,
                      username: this.selectedChat.product.owner_username,
                      email: this.selectedChat.product.owner_email
                  }
                : null;
        }
    }

    sendMessage(): void {
        if (
            !this.newMessage.trim() ||
            !this.selectedChat ||
            !this.chatParticipant
        ) {
            return;
        }

        const product_id = this.selectedChat.product.product_id;
        const to_user_id = this.chatParticipant.user_id;
        const messageContent = this.newMessage.trim();

        const tempMessage: Message = {
            from_user_id: this.userService.loggedInUser.user_id,
            to_user_id,
            product_id,
            message: messageContent,
            created_at: new Date().toISOString()
        };

        this.selectedChat.messages.push(tempMessage); // Add the message locally
        this.newMessage = ''; // Clear the input
        this.scrollToBottom(); // Ensure chat scrolls down

        this.messagingService
            .newMessage(product_id, to_user_id, messageContent)
            .subscribe({
                error: (error) => {
                    console.error('Error sending message:', error);
                }
            });
    }

    private listenForLiveUpdates(): void {
        if (this.eventSource) {
            this.eventSource.close();
        }

        this.eventSource = this.messagingService.getLiveUpdates();

        this.eventSource.onmessage = (event) => {
            const message: Message = JSON.parse(event.data);

            const chatKey = `${message.product_id}_${Math.min(
                message.from_user_id,
                message.to_user_id
            )}_${Math.max(message.from_user_id, message.to_user_id)}`;

            if (this.chats[chatKey]) {
                const chat = this.chats[chatKey];

                const messageExists = chat.messages.some(
                    (msg) =>
                        msg.message === message.message &&
                        msg.from_user_id === message.from_user_id &&
                        msg.to_user_id === message.to_user_id
                );

                if (!messageExists) {
                    chat.messages.push(message);

                    // Trigger change detection
                    this.cdr.detectChanges();

                    // Auto-scroll if the selected chat is updated
                    if (this.selectedChat && this.selectedChat === chat) {
                        this.scrollToBottom();
                    }
                }
            }
        };

        this.eventSource.onerror = (error) => {
            console.error('EventSource error:', error);
        };
    }

    ngOnDestroy(): void {
        this.eventSource?.close();
    }
}
