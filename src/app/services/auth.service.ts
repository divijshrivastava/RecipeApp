import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Models } from 'appwrite';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppwriteService } from './appwrite.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = signal<Models.User<Models.Preferences> | null>(null);
  loading = signal<boolean>(false);

  constructor(
    private appwrite: AppwriteService,
    private router: Router
  ) {
    // Best-effort fetch; app should still work if unauthenticated.
    this.refreshUser().subscribe();
  }

  refreshUser(): Observable<Models.User<Models.Preferences> | null> {
    this.loading.set(true);
    return from(this.appwrite.account.get()).pipe(
      tap((u) => this.user.set(u)),
      map((u) => u),
      catchError(() => {
        this.user.set(null);
        return of(null);
      }),
      tap(() => this.loading.set(false))
    );
  }

  isLoggedIn(): boolean {
    return !!this.user();
  }

  logout(): Observable<void> {
    this.loading.set(true);
    return from(this.appwrite.account.deleteSession('current')).pipe(
      tap(() => this.user.set(null)),
      tap(() => this.loading.set(false)),
      tap(() => this.router.navigate(['/recipes'])),
      map(() => undefined),
      catchError((err) => {
        this.loading.set(false);
        // Even if logout fails, clear local state and route away.
        this.user.set(null);
        this.router.navigate(['/recipes']);
        return throwError(() => err);
      })
    );
  }
}


