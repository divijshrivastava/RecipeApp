import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Account, Client } from 'appwrite';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = async (_route, state) => {
  const router = inject(Router);
  const client = new Client()
    .setEndpoint(environment.appwriteEndpoint)
    .setProject(environment.appwriteProjectId);
  const account = new Account(client);

  try {
    await account.get();
    return true;
  } catch (error) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}; 