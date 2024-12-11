import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, CommonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    isLoggedIn$!: Observable<boolean>;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.isLoggedIn$ = this.authService.isLoggedIn$;
    }
}
