import { Injectable } from '@angular/core';
import { ID, Query } from 'appwrite';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AppwriteService } from './appwrite.service';

export interface RatingSummary {
  avg: number;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class RatingsService {
  constructor(private appwrite: AppwriteService) {}

  isConfigured(): boolean {
    return (
      !!environment.appwriteDatabaseId &&
      !!environment.appwriteRatingsCollectionId &&
      environment.appwriteRatingsCollectionId.trim().length > 0
    );
  }

  getMyRating(recipeId: string): Observable<number | null> {
    if (!this.isConfigured()) return of(null);

    return from(this.appwrite.account.get()).pipe(
      switchMap((user) =>
        from(
          this.appwrite.databases.listDocuments(
            environment.appwriteDatabaseId,
            environment.appwriteRatingsCollectionId,
            [
              Query.equal('recipeId', recipeId),
              Query.equal('userId', user.$id),
              Query.limit(1),
            ]
          )
        )
      ),
      map((resp) => {
        const doc = resp.documents[0] as any;
        const v = doc?.value;
        return typeof v === 'number' ? v : null;
      }),
      catchError(() => of(null))
    );
  }

  getSummary(recipeId: string): Observable<RatingSummary> {
    if (!this.isConfigured()) return of({ avg: 0, count: 0 });

    return from(
      this.appwrite.databases.listDocuments(
        environment.appwriteDatabaseId,
        environment.appwriteRatingsCollectionId,
        [Query.equal('recipeId', recipeId), Query.limit(200)]
      )
    ).pipe(
      map((resp) => {
        const values = resp.documents
          .map((d: any) => d?.value)
          .filter((v: any) => typeof v === 'number' && v >= 1 && v <= 5);

        const count = values.length;
        const avg = count ? values.reduce((a: number, b: number) => a + b, 0) / count : 0;
        return { avg, count };
      }),
      catchError(() => of({ avg: 0, count: 0 }))
    );
  }

  setMyRating(recipeId: string, value: number): Observable<void> {
    if (!this.isConfigured()) {
      return throwError(
        () =>
          new Error(
            'Ratings are not configured. Set environment.appwriteRatingsCollectionId and create the ratings collection in Appwrite.'
          )
      );
    }

    if (value < 1 || value > 5) {
      return throwError(() => new Error('Rating must be between 1 and 5.'));
    }

    return from(this.appwrite.account.get()).pipe(
      switchMap((user) =>
        from(
          this.appwrite.databases.listDocuments(
            environment.appwriteDatabaseId,
            environment.appwriteRatingsCollectionId,
            [
              Query.equal('recipeId', recipeId),
              Query.equal('userId', user.$id),
              Query.limit(1),
            ]
          )
        ).pipe(
          switchMap((resp) => {
            const existing = resp.documents[0] as any;
            if (existing?.$id) {
              return from(
                this.appwrite.databases.updateDocument(
                  environment.appwriteDatabaseId,
                  environment.appwriteRatingsCollectionId,
                  existing.$id,
                  { value }
                )
              ).pipe(map(() => undefined));
            }

            return from(
              this.appwrite.databases.createDocument(
                environment.appwriteDatabaseId,
                environment.appwriteRatingsCollectionId,
                ID.unique(),
                {
                  recipeId,
                  userId: user.$id,
                  value,
                  created_at: new Date().toISOString(),
                }
              )
            ).pipe(map(() => undefined));
          })
        )
      )
    );
  }
}


