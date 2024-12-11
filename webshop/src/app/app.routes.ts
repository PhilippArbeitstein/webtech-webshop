import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MessagePageComponent } from './components/message-page/message-page.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { OwnProductsPageComponent } from './components/own-products-page/own-products-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'messages', component: MessagePageComponent },
    { path: 'profile', component: ProfilePageComponent },
    { path: 'own-products', component: OwnProductsPageComponent }
];
