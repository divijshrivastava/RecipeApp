import { Component, Input, Output } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recipe-summary',
  templateUrl: './recipe-summary.component.html',
  styleUrls: ['./recipe-summary.component.css']
})

export class RecipeSummaryComponent {

  @Input()
  recipe: Recipe;

  @Output()
  zoomIn: EventEmitter<Recipe> = new EventEmitter();

  public zoomInClicked() {
    this.zoomIn.emit(this.recipe);
  }

  constructor() { }

}
