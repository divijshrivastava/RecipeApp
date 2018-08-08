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
  @Input()
  dark_back: boolean;

  current_styles: any;

  @Output()
  zoomIn: EventEmitter<Recipe> = new EventEmitter();

  public zoomInClicked() {
    this.zoomIn.emit(this.recipe);
    console.log(this.dark_back);
    if (this.current_styles['font-size'] === '100%') {
      this.current_styles = { 'font-size': '150%' };
    } else {
      this.current_styles['font-size'] = '100%';
    }
  }

  constructor() {
    this.dark_back = false;
    this.current_styles = { 'font-size': '100%' };
  }





}
