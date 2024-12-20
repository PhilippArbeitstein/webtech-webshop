import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { UserService } from './user.service';
import { response } from 'express';
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
        // Pipe is being used to chain RxJS operators. In this case to apply the tap operator to the observable
        return this.httpClient
            .post('http://localhost:3000/login', loginCredentials, {
                withCredentials: true
            })
            .pipe(
                // Tap is a side-effect, that lets you perform side-effects on each emission of the observable without changing the observables data
                tap((response: any) => {
                    if (response.message === 'Login successful') {
                        this.isAuthenticated.next(true);
                    } else {
                        this.isAuthenticated.next(false);
                    }
                }),
                switchMap((response: any) => {
                    if (response.message === 'Login successful') {
                        return this.userService.getCurrentUser(
                            parseInt(response.id)
                        );
                    } else {
                        throw new Error('Login failed');
                    }
                })
            );
    }

    register(registrationCredentials: {
        address: {
            city: string;
            user_address: string;
            province: string;
        };
        user: {
            email: string;
            username: string;
            password: string;
        };
    }): Observable<any> {
        return this.httpClient
            .post(
                'http://localhost:3000/login/register',
                registrationCredentials,
                { withCredentials: true }
            )
            .pipe(
                tap((response: any) => {
                    if (response.message === 'Registration successful') {
                        this.isAuthenticated.next(true);
                        this.userService.loggedInUser = response.user;
                    } else {
                        this.isAuthenticated.next(false);
                    }
                })
            );
    }

    logout(): Observable<any> {
        return this.httpClient
            .get('http://localhost:3000/logout', {
                withCredentials: true
            })
            .pipe(
                tap((response: any) => {
                    if (response.message === 'Logout successful') {
                        this.overlayService.closeOverlay();
                        this.isAuthenticated.next(false);
                        this.userService.loggedInUser =
                            this.userService.emptyUser;
                    } else {
                        this.isAuthenticated.next(true);
                    }
                })
            );
    }

    checkSession(): void {
        this.httpClient
            .get('http://localhost:3000/login/session', {
                withCredentials: true
            })
            .pipe(
                tap((response: any) => {
                    this.isAuthenticated.next(response.loggedIn);
                }),
                switchMap((response: any) => {
                    const loggedIn: boolean = response.loggedIn;
                    if (loggedIn) {
                        return this.userService.getCurrentUser(
                            parseInt(response.user_id)
                        );
                    } else {
                        throw new Error('No active session');
                    }
                })
            )
            .subscribe({
                next: (user) => {},
                error: (error) => {
                    console.error(
                        'Session check failed or no active session:',
                        error
                    );
                    this.isAuthenticated.next(false);
                    this.userService.loggedInUser = this.userService.emptyUser;
                }
            });
    }
}
