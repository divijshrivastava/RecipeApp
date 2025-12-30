import { Component } from '@angular/core';
import { Account, Client } from 'appwrite';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

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
  private account: Account;

  constructor(private router: Router) {
    const client = new Client()
      .setEndpoint(environment.appwriteEndpoint)
      .setProject(environment.appwriteProjectId);
    
    this.account = new Account(client);
  }

  async login(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      this.isLoading = false;
      return;
    }

    try {
      await this.account.createEmailPasswordSession(this.email, this.password);
      this.router.navigate(['/newRecipe']);
    } catch (error: any) {
      this.isLoading = false;
      if (error.code === 401) {
        this.errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.message) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'An error occurred during login. Please try again.';
      }
      console.error('Login failed:', error);
    }
  }
}
