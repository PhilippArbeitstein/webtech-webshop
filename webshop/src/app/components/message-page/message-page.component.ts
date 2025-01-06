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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.routingService.setPreviousRoute('messages');

        this.route.queryParams.subscribe((params) => {
            const productId = params['product_id'];
            const toUserId = params['to_user_id'];
            this.fetchChats(() => {
                if (productId && toUserId) {
                    this.startOrSelectChat(productId, toUserId);
                    this.clearUrlParams();
                }
            });
        });

        this.listenForLiveUpdates();
    }

    private clearUrlParams(): void {
        this.router.navigate(['/messages']);
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

    fetchChats(callback?: () => void): void {
        this.messagingService.getUserChats().subscribe({
            next: (allChats) => {
                this.chats = allChats;
                this.loading = false;

                if (callback) {
                    callback();
                }

                // Select the first chat by default if none is selected
                if (!this.selectedChat) {
                    const firstChatKey = Object.keys(allChats)[0];
                    if (firstChatKey) {
                        this.selectChat(firstChatKey);
                    }
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
        if (!this.chats[chatKey]) {
            console.warn(`Chat with key ${chatKey} does not exist.`);
            return;
        }

        this.selectedChat = this.chats[chatKey];

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

        // Ensure the UI updates and scrolls to the selected chat
        this.cdr.detectChanges();

        setTimeout(() => {
            const chatElement = document.querySelector(
                `[data-chat-key="${chatKey}"]`
            );
            chatElement?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 0);
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

        this.selectedChat.messages.push(tempMessage);
        this.newMessage = '';
        this.scrollToBottom();

        this.messagingService
            .newMessage(product_id, to_user_id, messageContent)
            .subscribe({
                error: (error) => {
                    console.error('Error sending message:', error);
                }
            });
    }

    startOrSelectChat(productId: number, toUserId: number): void {
        const chatKey = `${productId}_${Math.min(
            this.userService.loggedInUser.user_id,
            toUserId
        )}_${Math.max(this.userService.loggedInUser.user_id, toUserId)}`;

        if (this.chats[chatKey]) {
            const existingChat = this.chats[chatKey];
            if (existingChat.messages && existingChat.messages.length > 0) {
                this.selectChat(chatKey);
            } else {
                this.messagingService
                    .newMessage(
                        productId,
                        toUserId,
                        'Hallo, ich bin an Ihrem Produkt interessiert'
                    )
                    .subscribe({
                        next: () => {
                            this.fetchChats(() => {
                                this.selectChat(chatKey);
                            });
                        },
                        error: (error) => {
                            console.error(
                                'Error sending initial message:',
                                error
                            );
                            this.errorMessage =
                                'Failed to send the initial message. Please try again.';
                        }
                    });
            }
        } else {
            this.messagingService
                .newMessage(
                    productId,
                    toUserId,
                    'Hallo, ich bin an Ihrem Produkt interessiert'
                )
                .subscribe({
                    next: () => {
                        this.fetchChats(() => {
                            this.selectChat(chatKey);
                        });
                    },
                    error: (error) => {
                        console.error('Error starting new chat:', error);
                        this.errorMessage =
                            'Failed to start a new chat. Please try again.';
                    }
                });
        }
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
                    this.cdr.detectChanges();
                }
            } else {
                // Dynamically fetch or create chat details for the new chat
                this.messagingService.getUserChats().subscribe({
                    next: (allChats) => {
                        if (allChats[chatKey]) {
                            this.chats[chatKey] = allChats[chatKey];
                        } else {
                            // Minimal placeholder structure for new chat
                            this.chats[chatKey] = {
                                product: {
                                    product_id: message.product_id,
                                    owner_email: '',
                                    owner_username: '',
                                    image_url: '',
                                    product_name: '',
                                    description: '',
                                    price: '',
                                    status_name: '',
                                    created_at: '',
                                    updated_at: '',
                                    additional_properties: {},
                                    type_name: '',
                                    city: '',
                                    address: '',
                                    province: '',
                                    address_details: '',
                                    advance_payment: '',
                                    rent_start: '',
                                    rent_end: ''
                                },
                                messages: [message],
                                participants: []
                            };
                        }

                        this.cdr.detectChanges();
                    },
                    error: (error) => {
                        console.error('Error fetching updated chats:', error);
                    }
                });
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
