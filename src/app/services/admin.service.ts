import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, switchMap, map } from 'rxjs';
import { AppwriteService } from './appwrite.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient, private appwrite: AppwriteService) {}

  deleteRecipeAsAdmin(recipeId: string): Observable<void> {
    return from((this.appwrite.account as any).createJWT()).pipe(
      switchMap((jwtResp: any) => {
        const jwt = jwtResp?.jwt;
        const headers = new HttpHeaders({
          Authorization: `Bearer ${jwt}`,
        });
        return this.http.delete<{ ok: boolean }>(
          `/api/admin/delete-recipe?recipeId=${encodeURIComponent(recipeId)}`,
          { headers }
        );
      }),
      map(() => undefined)
    );
  }
}


