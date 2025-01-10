import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, UserService } from './user.service';
import { OverlayService } from './overlay.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    isLoggedIn$ = this.isAuthenticated.asObservable();

    constructor(
        private httpClient: HttpClient,
        private userService: UserService,
        private overlayService: OverlayService
    ) {}

    login(loginCredentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this.httpClient
            .post<{ message: string; id: string }>(
                'http://localhost:3000/login',
                loginCredentials,
                { withCredentials: true }
            )
            .pipe(
                tap((response) => {
                    if (response.message === 'Login successful') {
                        this.isAuthenticated.next(true);
                    } else {
                        this.isAuthenticated.next(false);
                    }
                }),
                switchMap((response) => {
                    if (response.message === 'Login successful') {
                        const userId = parseInt(response.id, 10);
                        return this.userService.getCurrentUser(userId).pipe(
                            tap((user) => {
                                this.userService.setLoggedInUser(user);
                            }),
                            switchMap((user) => {
                                return this.userService.getCurrentAddress(
                                    user.address_id
                                );
                            })
                        );
                    } else {
                        throw new Error('Login failed');
                    }
                })
            );
    }

    register(registrationCredentials: {
        address: { city: string; user_address: string; province: string };
        user: { email: string; username: string; password: string };
    }): Observable<any> {
        return this.httpClient
            .post<{ message: string; user: User }>(
                'http://localhost:3000/login/register',
                registrationCredentials,
                { withCredentials: true }
            )
            .pipe(
                tap((response) => {
                    if (response.message === 'Registration successful') {
                        this.isAuthenticated.next(true);
                        this.userService.setLoggedInUser(response.user);
                    } else {
                        this.isAuthenticated.next(false);
                    }
                })
            );
    }

    logout(): Observable<any> {
        return this.httpClient
            .get<{ message: string }>('http://localhost:3000/logout', {
                withCredentials: true
            })
            .pipe(
                tap((response) => {
                    if (response.message === 'Logout successful') {
                        this.overlayService.closeOverlay();
                        this.isAuthenticated.next(false);
                        this.userService.clearUserData();
                    } else {
                        this.isAuthenticated.next(true);
                    }
                })
            );
    }

    checkSession(): Observable<void> {
        return this.httpClient
            .get<{ loggedIn: boolean; user_id?: string }>(
                'http://localhost:3000/login/session',
                { withCredentials: true }
            )
            .pipe(
                tap((response) => {
                    this.isAuthenticated.next(response.loggedIn);
                }),
                switchMap((response) => {
                    if (response.loggedIn && response.user_id) {
                        const userId = parseInt(response.user_id, 10);
                        return this.userService.getCurrentUser(userId).pipe(
                            tap((user) => {
                                this.userService.setLoggedInUser(user);
                            }),
                            switchMap((user) =>
                                this.userService
                                    .getCurrentAddress(user.address_id)
                                    .pipe(
                                        tap(() => {
                                            console.log(
                                                'Address fetched successfully'
                                            );
                                        })
                                    )
                            )
                        );
                    } else {
                        this.isAuthenticated.next(false);
                        this.userService.clearUserData();
                        throw new Error('No active session');
                    }
                }),
                tap(() => {
                    console.log('Session check complete.');
                }),
                map(() => {})
            );
    }
}
