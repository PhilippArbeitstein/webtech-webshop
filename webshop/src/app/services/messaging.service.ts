import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ProductDetails {
    product_id: number;
    owner_email: string;
    owner_username: string;
    image_url: string;
    product_name: string;
    description: string;
    price: string;
    status_name: string;
    created_at: string;
    updated_at: string;
    additional_properties: { [key: string]: any };
    type_name: string;
    city: string;
    address: string;
    province: string;
    address_details: string;
    advance_payment: string;
    rent_start: string;
    rent_end: string;
}

export interface Message {
    from_user_id: number;
    to_user_id: number;
    product_id: number;
    message: string;
    created_at: string;
}

export interface Participant {
    user_id: number;
    username: string;
    email: string;
}

export interface Chat {
    product: ProductDetails;
    messages: Message[];
    participants: Participant[];
}

@Injectable({
    providedIn: 'root'
})
export class MessagingService {
    constructor(private httpClient: HttpClient) {}

    getUserChats(): Observable<{ [key: string]: Chat }> {
        return this.httpClient
            .get<{
                [key: string]: {
                    product: ProductDetails;
                    messages: Message[];
                    participants: Participant[];
                };
            }>('http://localhost:3000/real-estate/messages', {
                withCredentials: true
            })
            .pipe(
                map((response) => {
                    const chats: { [key: string]: Chat } = {};
                    for (const [chatKey, data] of Object.entries(response)) {
                        chats[chatKey] = {
                            product: data.product,
                            messages: data.messages,
                            participants: data.participants // Directly map participants
                        };
                    }
                    return chats;
                })
            );
    }

    newMessage(
        product_id: number,
        to_user_id: number,
        message: string
    ): Observable<Message> {
        const payload = { product_id, to_user_id, message };
        return this.httpClient.post<Message>(
            'http://localhost:3000/real-estate/message',
            payload,
            { withCredentials: true }
        );
    }

    getLiveUpdates(): EventSource {
        return new EventSource('http://localhost:3000/real-estate/events', {
            withCredentials: true
        });
    }
}
