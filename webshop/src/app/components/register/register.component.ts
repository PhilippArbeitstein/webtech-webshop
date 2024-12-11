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

    constructor(fb: FormBuilder) {
        this.step1Form = fb.group({
            email: ['', [Validators.required, Validators.email]],
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
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach((control) => {
            control.markAsTouched();
        });
    }
}
