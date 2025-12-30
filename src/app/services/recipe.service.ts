import { Injectable, signal, WritableSignal } from '@angular/core';
import { Recipe } from '../model/recipe';
import { Observable, from, throwError, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AppwriteService } from './appwrite.service';
import { Storage, ID, Models, Permission, Role } from 'appwrite';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private storage: Storage;
  recipes = signal<Recipe[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private appWriteService: AppwriteService) {
    this.storage = new Storage(this.appWriteService.client);
  }

  private getCurrentUserSafe(): Observable<Models.User<Models.Preferences> | null> {
    return from(this.appWriteService.account.get()).pipe(catchError(() => of(null)));
  }

  /**
   * Get all recipes as Observable
   */
  getAllRecipes(): Observable<Recipe[]> {
    this.loading.set(true);
    this.error.set(null);

    return from(
      this.appWriteService.databases.listDocuments(
        environment.appwriteDatabaseId,
        environment.appwriteRecipeCollectionId
      )
    ).pipe(
      map((resp) => {
        const recipes = resp.documents.map((document) =>
          Recipe.recipeFromDocument(document)
        );
        this.recipes.set(recipes);
        this.loading.set(false);
    return recipes;
      }),
      catchError((error) => {
        this.error.set(error.message || 'Failed to load recipes');
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get recipe by ID
   */
  getRecipeById(recipe_id: string): Observable<Recipe> {
    this.loading.set(true);
    this.error.set(null);

    return from(
      this.appWriteService.databases.getDocument(
        environment.appwriteDatabaseId,
        environment.appwriteRecipeCollectionId,
        recipe_id
      )
    ).pipe(
      map((document) => {
        const recipe = Recipe.recipeFromDocument(document);
        this.loading.set(false);
    return recipe;
      }),
      catchError((error) => {
        this.error.set(error.message || 'Failed to load recipe');
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Upload image to Appwrite Storage
   */
  private uploadImage(file: File, recipeId: string, fileName: string): Promise<string> {
    const bucketId = environment.appwriteStorageBucketId;
    
    // Validate bucket ID is configured and not empty
    if (!bucketId || typeof bucketId !== 'string' || bucketId.trim() === '') {
      console.warn('Appwrite Storage Bucket ID not configured. Skipping image upload.');
      return Promise.resolve('');
    }

    const fileId = ID.unique();
    
    return this.storage
      .createFile(
        bucketId,
        fileId,
        file
      )
      .then((response) => {
        // Return the file preview URL
        const fileUrl = this.storage.getFileView(bucketId, response.$id);
        console.log(`Successfully uploaded image: ${fileUrl}`);
        return fileUrl;
      })
      .catch((error) => {
        console.error(`Error uploading image ${fileName} for recipe ${recipeId}:`, error);
        // Return empty string on error, recipe will still be created without image
        // In production, you might want to throw or handle this differently
        return '';
      });
  }

  /**
   * Add a new recipe with image uploads
   */
  addRecipe(recipe: Recipe, files: {
    cover_photo?: File;
    instruction_photo?: (File | undefined)[];
  }): Observable<Recipe> {
    this.loading.set(true);
    this.error.set(null);

    return this.getCurrentUserSafe().pipe(
      switchMap((user) => {
        // First create the recipe document
        const recipeData: any = {
          title: recipe.title,
          description: recipe.description,
          feeds_this_many: recipe.feeds_this_many,
          preparation_time: recipe.preparation_time,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cover_photo: '',
          keywords: recipe.keywords || [],
          category: recipe.category || 'Uncategorized',
          difficulty: recipe.difficulty || 'Medium',
          created_at: new Date().toISOString(),
        };

        // Helpful for future community features
        if (user) {
          recipeData.author_id = user.$id;
          recipeData.author_name = (user as any).name || (user as any).email || 'User';
        }

        // If Appwrite collection has "Document Security" enabled, permissions must be set.
        // We want public read, but only the creator can update/delete.
        const permissions: string[] = user
          ? [
              Permission.read(Role.any()),
              Permission.update(Role.user(user.$id)),
              Permission.delete(Role.user(user.$id)),
            ]
          : [Permission.read(Role.any())];

        const adminTeamId = (environment.appwriteAdminTeamId || '').trim();
        if (adminTeamId) {
          // Super admin team can delete any recipe
          permissions.push(Permission.delete(Role.team(adminTeamId)));
        }

        // Appwrite SDK supports permissions as the last argument.
        return from(
          (this.appWriteService.databases as any).createDocument(
            environment.appwriteDatabaseId,
            environment.appwriteRecipeCollectionId,
            ID.unique(),
            recipeData,
            permissions
          )
        );
      }),
      switchMap((document: any) => {
        const recipeId = document.$id as string;
        const uploadedRecipe = Recipe.recipeFromDocument(document);

        // Handle file uploads
        return from(this.handleFileUploads(recipeId, files, uploadedRecipe)).pipe(
          map(() => {
            this.loading.set(false);
            return uploadedRecipe;
          })
        );
      }),
      catchError((error: any) => {
        const code = error?.code;
        const msg = error?.message || 'Failed to create recipe';

        // Appwrite permission errors are usually 401/403.
        if (code === 401 || code === 403) {
          const help =
            'Not authorized to create recipes. In Appwrite Console → Databases → your DB → your Recipes collection → Permissions, ensure **Create** includes **Users** (or your chosen role). If "Document Security" is enabled, this app now sets per-document permissions (public read, owner update/delete).';
          this.error.set(help);
          this.loading.set(false);
          return throwError(() => new Error(help));
        }

        this.error.set(msg);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Handle file uploads for recipe
   */
  private async handleFileUploads(
    recipeId: string,
    files: {
      cover_photo?: File;
      instruction_photo?: (File | undefined)[];
    },
    recipe: Recipe
  ): Promise<void> {
    // Upload cover photo if provided
    if (files.cover_photo) {
      try {
        const coverPhotoUrl = await this.uploadImage(
          files.cover_photo,
          recipeId,
          'cover'
        );
        recipe.cover_photo = coverPhotoUrl;

        // Update document with cover photo URL
        await this.appWriteService.databases.updateDocument(
          environment.appwriteDatabaseId,
          environment.appwriteRecipeCollectionId,
          recipeId,
          { cover_photo: coverPhotoUrl }
        );
      } catch (error) {
        console.error('Error uploading cover photo:', error);
      }
    }

    // Upload instruction photos if provided
    if (files.instruction_photo && files.instruction_photo.length > 0) {
      for (let i = 0; i < files.instruction_photo.length; i++) {
        if (files.instruction_photo[i] && recipe.instructions[i]) {
          try {
            const photoUrl = await this.uploadImage(
              files.instruction_photo[i]!,
              recipeId,
              `instruction_${i}`
            );
            recipe.instructions[i].photo = photoUrl;
          } catch (error) {
            console.error(`Error uploading instruction photo ${i}:`, error);
          }
        }
      }

      // Update document with instruction photos
      await this.appWriteService.databases.updateDocument(
        environment.appwriteDatabaseId,
        environment.appwriteRecipeCollectionId,
        recipeId,
        { instructions: recipe.instructions }
      );
    }
  }

  /**
   * Update an existing recipe
   */
  updateRecipe(recipeId: string, recipe: Recipe, files?: {
    cover_photo?: File;
    instruction_photo?: (File | undefined)[];
  }): Observable<Recipe> {
    this.loading.set(true);
    this.error.set(null);

    const updateData: any = {
      title: recipe.title,
      description: recipe.description,
      feeds_this_many: recipe.feeds_this_many,
      preparation_time: recipe.preparation_time,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      keywords: recipe.keywords || [],
      category: recipe.category || 'Uncategorized',
      difficulty: recipe.difficulty || 'Medium',
      updated_at: new Date().toISOString(),
    };

    return from(
      this.appWriteService.databases.updateDocument(
        environment.appwriteDatabaseId,
        environment.appwriteRecipeCollectionId,
        recipeId,
        updateData
      )
    ).pipe(
      map(async (document) => {
        // Handle file uploads similar to addRecipe
        // ... (implementation similar to addRecipe)
        const updatedRecipe = Recipe.recipeFromDocument(document);
        this.loading.set(false);
        return updatedRecipe;
      }),
      map((promise) => from(promise)),
      map((obs) => obs as any),
      catchError((error) => {
        this.error.set(error.message || 'Failed to update recipe');
        this.loading.set(false);
        return throwError(() => error);
      })
    ) as Observable<Recipe>;
  }

  /**
   * Delete a recipe
   */
  deleteRecipe(recipeId: string): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return from(
      this.appWriteService.databases.deleteDocument(
        environment.appwriteDatabaseId,
        environment.appwriteRecipeCollectionId,
        recipeId
      )
    ).pipe(
      map(() => {
        // Remove from local state
        const currentRecipes = this.recipes();
        this.recipes.set(currentRecipes.filter(r => r.id !== recipeId));
        this.loading.set(false);
      }),
      catchError((error) => {
        this.error.set(error.message || 'Failed to delete recipe');
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Search recipes by query
   */
  searchRecipes(query: string): Observable<Recipe[]> {
    if (!query.trim()) {
      return this.getAllRecipes();
    }

    this.loading.set(true);
    this.error.set(null);

    return from(
      this.appWriteService.databases.listDocuments(
        environment.appwriteDatabaseId,
        environment.appwriteRecipeCollectionId,
        [
          // Add search queries here based on Appwrite query syntax
        ]
      )
    ).pipe(
      map((resp) => {
        const allRecipes = resp.documents.map((document) =>
          Recipe.recipeFromDocument(document)
        );
        
        // Client-side filtering as fallback
        const filtered = allRecipes.filter(
          (recipe) =>
            recipe.title.toLowerCase().includes(query.toLowerCase()) ||
            recipe.description.toLowerCase().includes(query.toLowerCase()) ||
            recipe.keywords?.some(k => k.toLowerCase().includes(query.toLowerCase()))
        );
        
        this.loading.set(false);
        return filtered;
      }),
      catchError((error) => {
        this.error.set(error.message || 'Failed to search recipes');
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Filter recipes by category
   */
  filterByCategory(category: string): Observable<Recipe[]> {
    if (!category || category === 'All') {
      return this.getAllRecipes();
    }

    return this.getAllRecipes().pipe(
      map((recipes) => recipes.filter((r) => r.category === category))
    );
  }
}
