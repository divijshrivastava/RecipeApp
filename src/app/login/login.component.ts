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
  private account: Account;

  constructor(private router: Router) {
    const client = new Client()
      .setEndpoint(environment.appwriteEndpoint)
      .setProject(environment.appwriteProjectId);
    
    this.account = new Account(client);
  }

  async login(event: Event) {
    event.preventDefault();
    try {
      await this.account.createEmailPasswordSession(this.email, this.password);
      this.router.navigate(['/newRecipe']);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

}
