import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { Chat, MessagingService } from '../../services/messaging.service';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { RoutingService } from '../../services/routing.service';

@Component({
    selector: 'app-message-page',
    imports: [NavbarComponent, FooterComponent, CommonModule, RouterLink],
    templateUrl: './message-page.component.html',
    styleUrls: ['./message-page.component.css']
})
export class MessagePageComponent {
    chats: { [product_id: string]: Chat } = {};
    selectedChat: Chat | null = null;
    chatParticipant: { username: string; email: string } | null = null;
    loading: boolean = true;
    errorMessage: string = '';

    constructor(
        private messagingService: MessagingService,
        public userService: UserService,
        private routingService: RoutingService
    ) {}

    ngOnInit() {
        this.routingService.setPreviousRoute('messages');
        this.getAllChats();
    }

    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop =
                this.scrollContainer.nativeElement.scrollHeight;
        } catch (err) {}
    }

    getAllChats(): void {
        this.messagingService.getUserChats().subscribe({
            next: (chats) => {
                this.chats = chats;
                this.loading = false;
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

    selectChat(chatId: string): void {
        this.selectedChat = this.chats[chatId];

        if (!this.selectedChat) {
            this.chatParticipant = null;
            return;
        }

        const isProductOwner =
            this.selectedChat.product.owner_email ===
            this.userService.loggedInUser.email;

        // If the logged-in user is the product owner, show the other participant (buyer)
        if (isProductOwner) {
            this.chatParticipant =
                this.selectedChat.participants.find(
                    (participant) =>
                        participant.email !==
                        this.userService.loggedInUser.email
                ) || null;
        } else {
            // If the logged-in user is not the product owner, show the owner
            this.chatParticipant = {
                username: this.selectedChat.product.owner_username,
                email: this.selectedChat.product.owner_email
            };
        }
    }
}
