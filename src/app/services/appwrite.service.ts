import { Injectable } from '@angular/core';
import { Client, Account, Databases, Role } from 'appwrite';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppwriteService {
  client: Client;
  databases: Databases;
  account: Account;

  constructor() {
     this.client = new Client()
      .setEndpoint(environment.appwriteEndpoint)//environment.appwriteEndpoint) 'http://localhost/v1'
      .setProject(environment.appwriteProjectId);//environment.appwriteProjectId);
      debugger;
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
   }
}
