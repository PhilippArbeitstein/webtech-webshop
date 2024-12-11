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

    constructor(private fb: FormBuilder) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
        } else {
            console.log('Form submitted', this.loginForm.value);
        }
    }
}
