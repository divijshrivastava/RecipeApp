import { Component, Input, Output } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { EventEmitter } from '@angular/core';

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

  @Output()
  zoomIn: EventEmitter<Recipe> = new EventEmitter();

  @Output()
  userClick: EventEmitter<number> = new EventEmitter();

  userClicked() {
    this.userClick.emit(this.recipe?.id);
  }

   constructor() {
    this.dark_back = false;
    this.current_styles = { 'font-size': '100%' };
  }





}
