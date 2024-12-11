import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    isLoggedIn$ = this.isAuthenticated.asObservable();

    constructor(private httpClient: HttpClient) {}

    login(loginCredentials: {
        email: string;
        password: string;
    }): Observable<any> {
        // Pipe is being used to chain RxJS operators. In this case to apply the tap operator to the observable
        return this.httpClient
            .post('http://localhost:3000/login', loginCredentials)
            .pipe(
                // Tap is a side-effect, that lets you perform side-effects on each emission of the observable without changing the observables data
                tap((response: any) => {
                    if (response.message === 'Login successful') {
                        this.isAuthenticated.next(true);
                    } else {
                        this.isAuthenticated.next(false);
                    }
                })
            );
    }
}
