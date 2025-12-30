import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { RecipeService } from '../../services/recipe.service';
import { Router } from '../../../../node_modules/@angular/router';
import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-edit-new-recipe',
  templateUrl: './edit-new-recipe.component.html',
  styleUrls: ['./edit-new-recipe.component.scss']
})
export class EditNewRecipeComponent implements OnInit {

  recipe_in_progress: Recipe;
  disabled_add_recipe_button: boolean;
  recipeForm: FormGroup = new FormGroup({});
  cover_photo_for_viewing: string = 'assets/empty-bowl.png';
  instruction_recipe_photos: string[] = [];
  cover_photo_for_upload: File | undefined;
  instruction_photo_for_upload: (File | undefined)[] = [];

  buildRecipeForm(): void {
    const fg :any= {
      'title': new FormControl(this.recipe_in_progress.title, [Validators.required, noTamatar()]),
      'description': new FormControl(this.recipe_in_progress.description, [Validators.required, noGaali()]),
      'feeds_this_many': new FormControl(this.recipe_in_progress.feeds_this_many, [Validators.required, Validators.min(1),
      Validators.max(1000)]),
      'preparation_time':
        new FormControl(this.recipe_in_progress.preparation_time, [Validators.required, Validators.min(1), Validators.max(1000)]),
      'category': new FormControl(this.recipe_in_progress.category || 'Uncategorized', [Validators.required]),
      'difficulty': new FormControl(this.recipe_in_progress.difficulty || 'Medium', [Validators.required])
    };
    for (let i = 0; i < this.recipe_in_progress.ingredients.length; i++) {
      fg['ingredient_' + i] =
        new FormControl(this.recipe_in_progress.ingredients[i].name,
          [Validators.required]);
      const measureValue = this.recipe_in_progress.ingredients[i].quantity && this.recipe_in_progress.ingredients[i].unit
        ? `${this.recipe_in_progress.ingredients[i].quantity} ${this.recipe_in_progress.ingredients[i].unit}`
        : '';
      fg['ingredient_measure_' + i] = new FormControl(measureValue, [Validators.required]);
    }

    for (let i = 0; i < this.recipe_in_progress.instructions.length; i++) {
      fg['instruction_' + i] =
        new FormControl(this.recipe_in_progress.instructions[i].action,
          [Validators.required]);
      fg['instruction_photo_' + i] = new FormControl(this.recipe_in_progress.instructions[i].photo);
      //          new FormControl(this.recipe_in_progress.instructions[i].photo,
      //            []);
    }
    this.recipeForm = new FormGroup(fg);
  }

  constructor(private recipeService: RecipeService, private router: Router) {
    this.recipe_in_progress = Recipe.inputRecipe();
    this.disabled_add_recipe_button = true;
    this.instruction_recipe_photos = [];
    this.cover_photo_for_upload = undefined;
    this.instruction_photo_for_upload = [];
    this.buildRecipeForm();
  }

  readUrl(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const reader = new FileReader();

      reader.onload = () => {
        this.cover_photo_for_viewing = reader.result as string;
      };

      reader.readAsDataURL(target.files[0]);
      this.cover_photo_for_upload = target.files[0];
    }
  }

  readInstUrl(i: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const reader = new FileReader();

      reader.onload = () => {
        this.instruction_recipe_photos[i] = reader.result as string;
      };
      reader.readAsDataURL(target.files[0]);
      this.instruction_photo_for_upload[i] = target.files[0];
    }
  }
  
  ngOnInit() {
  }

  addRecipeClicked() {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    this.disabled_add_recipe_button = true;

    this.recipeService.addRecipe(
      this.recipe_in_progress,
      {
        cover_photo: this.cover_photo_for_upload,
        instruction_photo: this.instruction_photo_for_upload
      }
    ).subscribe({
      next: (recipe) => {
        this.router.navigate(['recipes', recipe.id]);
      },
      error: (error) => {
        alert('Failed to create recipe: ' + (error.message || 'Unknown error'));
        this.disabled_add_recipe_button = false;
      }
    });
  }

  validateForm(): void {
    this.disabled_add_recipe_button = true;
    const feeds = parseInt(String(this.recipe_in_progress.feeds_this_many), 10);
    const prepTime = parseInt(String(this.recipe_in_progress.preparation_time), 10);

    if (!this.recipe_in_progress.title || this.recipe_in_progress.title.length < 1) {
      return;
    }
    if (!this.recipe_in_progress.description || this.recipe_in_progress.description.length < 1) {
      return;
    }
    if (!this.recipe_in_progress.preparation_time || this.recipe_in_progress.preparation_time < 1) {
      return;
    }

    if (!this.recipe_in_progress.feeds_this_many || this.recipe_in_progress.feeds_this_many < 1) {
      return;
    }

    if (isNaN(feeds) || feeds < 1 || feeds > 1000) {
      return;
    }
    if (isNaN(prepTime) || prepTime < 1) {
      return;
    }

    if (this.recipe_in_progress.ingredients && this.recipe_in_progress.ingredients.length > 0) {
      for (const ingr of this.recipe_in_progress.ingredients) {
        if (!ingr.quantity || !ingr.unit || ingr.unit.length < 1) {
          return;
        }
        if (!ingr.name || ingr.name.length < 1) {
          return;
        }
      }
    }

    if (this.recipe_in_progress.instructions && this.recipe_in_progress.instructions.length > 0) {
      for (const inst of this.recipe_in_progress.instructions) {
        if (!inst.action || inst.action.length < 1) {
          return;
        }
      }
    }
    this.disabled_add_recipe_button = false;
  }

  addNewIngredient() {
    if (!this.recipe_in_progress.ingredients) {
      this.recipe_in_progress.ingredients = [{ name: "", quantity: 0, unit: "" }];
    } else {
      this.recipe_in_progress.ingredients.push({ name: "", quantity: 0, unit: "" });
    }
    this.buildRecipeForm();
  }

  removeIngredient(ingredient_index: number): void {
    if (this.recipe_in_progress.ingredients && ingredient_index >= 0 && ingredient_index < this.recipe_in_progress.ingredients.length) {
      this.recipe_in_progress.ingredients.splice(ingredient_index, 1);
      this.buildRecipeForm();
    }
  }

  updateIngredientMeasure(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();
    if (value && this.recipe_in_progress.ingredients[index]) {
      // Try to parse quantity and unit from the input (e.g., "2 cups" -> quantity: 2, unit: "cups")
      const parts = value.split(/\s+/);
      if (parts.length >= 2) {
        const quantity = parseFloat(parts[0]);
        if (!isNaN(quantity)) {
          this.recipe_in_progress.ingredients[index].quantity = quantity;
          this.recipe_in_progress.ingredients[index].unit = parts.slice(1).join(' ');
        }
      } else if (parts.length === 1) {
        // If only one part, assume it's the unit and set quantity to 1
        const quantity = parseFloat(parts[0]);
        if (!isNaN(quantity)) {
          this.recipe_in_progress.ingredients[index].quantity = quantity;
          this.recipe_in_progress.ingredients[index].unit = '';
        } else {
          this.recipe_in_progress.ingredients[index].quantity = 1;
          this.recipe_in_progress.ingredients[index].unit = parts[0];
        }
      }
    }
  }

  addNewInstructions() {
    if (!this.recipe_in_progress.instructions) {
      this.recipe_in_progress.instructions = [{ action: "", photo: "" }];
      this.instruction_recipe_photos = [];
      this.instruction_photo_for_upload = [];
    } else {
      this.recipe_in_progress.instructions.push({ action: "", photo: "" });
      this.instruction_recipe_photos.push('');
      this.instruction_photo_for_upload.push(undefined);
    }
    this.buildRecipeForm();
  }

  removeInstruction(instruction_index: number): void {
    if (this.recipe_in_progress.instructions && instruction_index >= 0 && instruction_index < this.recipe_in_progress.instructions.length) {
      this.recipe_in_progress.instructions.splice(instruction_index, 1);
      if (this.instruction_recipe_photos.length > instruction_index) {
        this.instruction_recipe_photos.splice(instruction_index, 1);
      }
      if (this.instruction_photo_for_upload.length > instruction_index) {
        this.instruction_photo_for_upload.splice(instruction_index, 1);
      }
      this.buildRecipeForm();
    }
  }
}

export function noTamatar(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (control.value.toLowerCase().indexOf('tamatar') !== -1
      || control.value.toLowerCase().indexOf('aloo') !== -1
      || control.value.toLowerCase().indexOf('fuck') !== -1

    ) {
      return {
        'noTamatar': { value: control.value }
      };
    }
    return {};
  };
}

export function noGaali(): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } => {
    if (control.value.toLowerCase().indexOf('gaali') !== -1) {
      return {
        'noGaali': control.value
      };
    }
    return {};
  };
}
