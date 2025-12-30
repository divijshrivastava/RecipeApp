import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Models, Teams } from 'appwrite';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AppwriteService } from './appwrite.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = signal<Models.User<Models.Preferences> | null>(null);
  loading = signal<boolean>(false);
  isAdmin = signal<boolean>(false);

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
      switchMap((u) =>
        this.computeIsAdmin(u).pipe(
          tap((isAdmin) => this.isAdmin.set(isAdmin)),
          map(() => u)
        )
      ),
      catchError(() => {
        this.user.set(null);
        this.isAdmin.set(false);
        return of(null);
      }),
      tap(() => this.loading.set(false))
    );
  }

  private computeIsAdmin(user: Models.User<Models.Preferences> | null): Observable<boolean> {
    if (!user) return of(false);

    const explicitAdmins = environment.superAdminUserIds || [];
    if (explicitAdmins.includes(user.$id)) return of(true);

    // Optional: allow setting a super admin flag on the user's preferences.
    // Example: set prefs.superAdmin = true for specific accounts in Appwrite.
    const prefs: any = (user as any).prefs;
    if (prefs?.superAdmin === true) return of(true);

    const adminTeamId = (environment.appwriteAdminTeamId || '').trim();
    if (!adminTeamId) return of(false);

    // Best-effort: check membership via Teams API. This may require the current user
    // to have permission to read memberships for this team; if it fails, we fall back to false.
    const teams = new Teams(this.appwrite.client);
    return from((teams as any).listMemberships(adminTeamId)).pipe(
      map((resp: any) => {
        const memberships = resp?.memberships || [];
        return memberships.some((m: any) => {
          const isUser = m?.userId === user.$id;
          const isConfirmed = m?.confirmed === true || m?.confirm === true;
          return isUser && isConfirmed;
        });
      }),
      catchError(() => of(false))
    );
  }

  login(email: string, password: string): Observable<Models.Session> {
    this.loading.set(true);
    return from(this.appwrite.account.createEmailPasswordSession(email, password)).pipe(
      switchMap((session) =>
        this.refreshUser().pipe(
          map(() => session)
        )
      ),
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.user();
  }

  logout(): Observable<void> {
    this.loading.set(true);
    return from(this.appwrite.account.deleteSession('current')).pipe(
      tap(() => this.user.set(null)),
      tap(() => this.isAdmin.set(false)),
      tap(() => this.loading.set(false)),
      tap(() => this.router.navigate(['/recipes'])),
      map(() => undefined),
      catchError((err) => {
        this.loading.set(false);
        // Even if logout fails, clear local state and route away.
        this.user.set(null);
        this.isAdmin.set(false);
        this.router.navigate(['/recipes']);
        return throwError(() => err);
      })
    );
  }
}


