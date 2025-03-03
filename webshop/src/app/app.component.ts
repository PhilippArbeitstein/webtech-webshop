import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'webshop';
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.checkSession().subscribe({
            next: () => {
                console.log('Session checked successfully.');
            },
            error: (err) => {
                console.error('Session check failed:', err);
            }
        });
    }
}
