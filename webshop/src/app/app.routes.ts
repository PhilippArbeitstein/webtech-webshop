import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent }
];
