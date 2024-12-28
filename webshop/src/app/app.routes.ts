import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MessagePageComponent } from './components/message-page/message-page.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { OwnProductsPageComponent } from './components/own-products-page/own-products-page.component';
import { RetailPageComponent } from './components/retail-page/retail-page.component';
import { VehiclePageComponent } from './components/vehicle-page/vehicle-page.component';
import { RealestatePageComponent } from './components/realestate-page/realestate-page.component';
import { RealestateDetailsComponent } from './components/realestate-details/realestate-details.component';
import { VehicleDetailsComponent } from './components/vehicle-details/vehicle-details.component';
export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'messages', component: MessagePageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'own-products', component: OwnProductsPageComponent },
  { path: 'retail', component: RetailPageComponent },
  { path: 'vehicles', component: VehiclePageComponent },
  { path: 'real-estate', component: RealestatePageComponent },
  {
    path: 'real-estate-details/:product_id',
    component: RealestateDetailsComponent,
  },
  {
    path: 'vehicle-details/:product_id',
    component: VehicleDetailsComponent,
  },
];
