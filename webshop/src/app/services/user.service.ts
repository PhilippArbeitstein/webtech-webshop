import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pipe, tap } from 'rxjs';

export interface User {
    user_id: number;
    email: string;
    username: string;
    password: string;
    address_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface Address {
    address_id: number;
    city: string;
    address: string;
    province: string;
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
        address_id: -1,
        created_at: new Date(),
        updated_at: new Date()
    };

    emptyAddress: Address = {
        address_id: -1,
        city: '',
        address: '',
        province: ''
    };

    private loggedInUserSubject = new BehaviorSubject<User>(this.emptyUser);
    private loggedInUserAddressSubject = new BehaviorSubject<Address>(
        this.emptyAddress
    );

    loggedInUser$ = this.loggedInUserSubject.asObservable();
    loggedInUserAddress$ = this.loggedInUserAddressSubject.asObservable();

    constructor(private httpClient: HttpClient) {}

    getCurrentUser(user_id: number): Observable<User> {
        return this.httpClient
            .get<User>(`http://localhost:3000/user/${user_id}`, {
                withCredentials: true
            })
            .pipe(
                tap((user: User) => {
                    this.loggedInUserSubject.next(user); // Update BehaviorSubject
                })
            );
    }

    getCurrentAddress(address_id: number): Observable<Address> {
        return this.httpClient
            .get<Address>(`http://localhost:3000/user/address/${address_id}`, {
                withCredentials: true
            })
            .pipe(
                tap((address: Address) => {
                    this.loggedInUserAddressSubject.next(address); // Update BehaviorSubject
                })
            );
    }

    clearUserData(): void {
        this.loggedInUserSubject.next(this.emptyUser);
        this.loggedInUserAddressSubject.next(this.emptyAddress);
    }

    setLoggedInUser(user: User): void {
        this.loggedInUserSubject.next(user);
    }

    updateUser(updateCredentials: {
        user_id: number;
        email: string;
        username: string;
        password?: string;
        address_id: number;
        city: string;
        address: string;
        province: string;
    }): Observable<any> {
        return this.httpClient
            .put('http://localhost:3000/user/update', updateCredentials, {
                withCredentials: true
            })
            .pipe(
                tap((response: any) => {
                    if (response.user) {
                        this.loggedInUserSubject.next(response.user);
                    }
                })
            );
    }
}
