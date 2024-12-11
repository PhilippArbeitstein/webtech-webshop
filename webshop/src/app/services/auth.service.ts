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

    checkSession() {
        this.httpClient
            .get('http://localhost:3000/login/session', {
                withCredentials: true
            })
            .subscribe({
                next: (response: any) => {
                    console.log('Session response:', response);
                    this.isAuthenticated.next(response.loggedIn);
                },
                error: (error) => {
                    console.error('Session check failed:', error);
                    this.isAuthenticated.next(false);
                }
            });
    }
}
