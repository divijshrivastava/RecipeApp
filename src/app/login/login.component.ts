import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  private returnUrl: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  login(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      this.isLoading = false;
      return;
    }

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl || '/newRecipe');
      },
      error: (error: any) => {
        this.isLoading = false;
        if (error?.code === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (error?.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An error occurred during login. Please try again.';
        }
        console.error('Login failed:', error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
