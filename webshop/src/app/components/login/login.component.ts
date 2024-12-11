import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [
        NavbarComponent,
        FooterComponent,
        ReactiveFormsModule,
        CommonModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
        } else {
            this.authService
                .login({
                    email: this.loginForm.get('email')?.value,
                    password: this.loginForm.get('password')?.value
                })
                .subscribe({
                    next: (response) => {
                        this.router.navigate(['']);
                    },
                    error: (err) => {
                        console.log('Login failed:', err);
                    }
                });
        }
    }
}
