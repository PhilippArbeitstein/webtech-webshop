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
import { Address, User, UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile-page',
    imports: [
        NavbarComponent,
        FooterComponent,
        ReactiveFormsModule,
        CommonModule
    ],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
    currentStep = 1;
    step1Form: FormGroup;
    step2Form: FormGroup;
    currentUser: User;
    currentAddress: Address;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router
    ) {
        this.currentUser = userService.emptyUser;
        this.currentAddress = userService.emptyAddress;

        this.step1Form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });

        this.step2Form = this.fb.group({
            city: ['', [Validators.required, Validators.minLength(2)]],
            address: ['', [Validators.required, Validators.minLength(2)]],
            province: ['', [Validators.required, Validators.minLength(2)]]
        });
    }

    ngOnInit(): void {
        this.userService.loggedInUser$.subscribe((user: User) => {
            this.currentUser = user;
            this.step1Form.patchValue({
                email: user.email,
                username: user.username,
                password: user.password
            });
        });

        this.userService.loggedInUserAddress$.subscribe((address: Address) => {
            this.currentAddress = address;
            this.step2Form.patchValue({
                city: address.city,
                address: address.address,
                province: address.province
            });
        });

        this.step1Form = this.fb.group({
            email: [
                this.currentUser.email,
                [Validators.required, Validators.email]
            ],
            username: [this.currentUser.username, [Validators.required]],
            password: [
                this.currentUser.password,
                [Validators.required, Validators.minLength(8)]
            ]
        });

        this.step2Form = this.fb.group({
            city: [
                this.currentAddress.city,
                [Validators.required, Validators.minLength(2)]
            ],
            address: [
                this.currentAddress.address,
                [Validators.required, Validators.minLength(2)]
            ],
            province: [
                this.currentAddress.province,
                [Validators.required, Validators.minLength(2)]
            ]
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
            const updateProfileCredentials = {
                user_id: this.currentUser.user_id,
                email: this.step1Form.get('email')?.value as string,
                username: this.step1Form.get('username')?.value as string,
                password: this.step1Form.get('password')?.value as string,

                address_id: this.currentUser.address_id,
                city: this.step2Form.get('city')?.value as string,
                address: this.step2Form.get('address')?.value as string,
                province: this.step2Form.get('province')?.value as string
            };

            this.userService.updateUser(updateProfileCredentials).subscribe(
                (response) => {
                    console.log('Profile updated successfully:', response);
                    alert('Profile updated!');
                    this.router.navigate(['/']); // Navigate to home page
                },
                (error) => {
                    console.error('Error updating profile:', error);
                    alert('Failed to update profile.');
                }
            );
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach((control) => {
            control.markAsTouched();
        });
    }
}
