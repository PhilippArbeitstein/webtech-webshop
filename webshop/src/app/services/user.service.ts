import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe, tap } from 'rxjs';

export interface User {
    user_id: number;
    email: string;
    username: string;
    password: string;
    address_id: number;
    created_at: Date;
    updated_at: Date;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    emptyUser: User = {
        user_id: -1,
        email: '',
        username: '',
        password: '',
        address_id: 0,
        created_at: new Date(),
        updated_at: new Date()
    };

    loggedInUser: User = this.emptyUser;

    constructor(private httpClient: HttpClient) {}

    getCurrentUser(user_id: number): Observable<User> {
        return this.httpClient
            .get<User>(`http://localhost:3000/user/${user_id}`, {
                withCredentials: true
            })
            .pipe(
                tap((response: User) => {
                    this.loggedInUser = response;
                    console.log('Logged in user:', this.loggedInUser);
                })
            );
    }
}
