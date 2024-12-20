import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [
        FooterComponent,
        NavbarComponent,
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    currentStep = 1;
    step1Form: FormGroup;
    step2Form: FormGroup;

    constructor(
        fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.step1Form = fb.group({
            email: ['', [Validators.required, Validators.email]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });

        this.step2Form = fb.group({
            city: ['', Validators.required],
            address: ['', Validators.required],
            province: ['', Validators.required]
        });
    }

    goToFormStep(step: number) {
        if (step === 2 && this.step1Form.invalid) {
            this.markFormGroupTouched(this.step1Form);
            return;
        }
        this.currentStep = step;
    }

    submitForm() {
        if (this.step2Form.invalid) {
            this.markFormGroupTouched(this.step2Form);
            return;
        } else {
            const registrationCredentials = {
                address: {
                    city: this.step2Form.get('city')?.value as string,
                    user_address: this.step2Form.get('address')
                        ?.value as string,
                    province: this.step2Form.get('province')?.value as string
                },
                user: {
                    email: this.step1Form.get('email')?.value as string,
                    username: this.step1Form.get('username')?.value as string,
                    password: this.step1Form.get('password')?.value as string
                }
            };
            this.authService.register(registrationCredentials).subscribe({
                next: (response) => {
                    this.router.navigate(['']);
                },
                error: (err) => {
                    console.log('Registration failed:', err);
                }
            });
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach((control) => {
            control.markAsTouched();
        });
    }
}
