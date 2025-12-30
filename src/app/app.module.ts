import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeSummaryComponent } from './components/recipe-summary/recipe-summary.component';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';
import { EditNewRecipeComponent } from './components/edit-new-recipe/edit-new-recipe.component';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app.routes';
import { LoginComponent } from './login/login.component';
import { SavedRecipesComponent } from './components/saved-recipes/saved-recipes.component';


@NgModule({
  declarations: [
    AppComponent,
    RecipeSummaryComponent,
    RecipeListComponent,
    RecipeDetailsComponent,
    EditNewRecipeComponent,
    LoginComponent,
    SavedRecipesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
     ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
