import { Component, Input } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-recipe-summary',
  templateUrl: './recipe-summary.component.html',
  styleUrls: ['./recipe-summary.component.scss']
})

export class RecipeSummaryComponent {

  @Input()
  recipe: Recipe | undefined;
  @Input()
  dark_back: Boolean;

  current_styles: any;

  toggleSaved(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.recipe?.id) {
      this.favorites.toggle(this.recipe.id);
    }
  }

   constructor(public favorites: FavoritesService, public auth: AuthService) {
    this.dark_back = false;
    this.current_styles = { 'font-size': '100%' };
  }





}
