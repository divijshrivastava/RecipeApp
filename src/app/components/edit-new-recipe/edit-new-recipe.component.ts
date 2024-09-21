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
  cover_photo_for_viewing : string= 'assets/empty-bowl.png';
  instruction_recipe_photos: string[] | any;
  cover_photo_for_upload: File | undefined;
  instruction_photo_for_upload: File[];

  buildRecipeForm(): void {
    const fg :any= {
      'title': new FormControl(this.recipe_in_progress.title, [Validators.required, noTamatar()]),
      'description': new FormControl(this.recipe_in_progress.description, [Validators.required, noGaali()]),
      'feeds_this_many': new FormControl(this.recipe_in_progress.feeds_this_many, [Validators.required, Validators.min(1),
      Validators.max(1000)]),
      'preparation_time':
        new FormControl(this.recipe_in_progress.preparation_time, [Validators.required, Validators.min(1), Validators.max(1000)])
    };
    for (let i = 0; i < this.recipe_in_progress.ingredients.length; i++) {
      fg['ingredient_' + i] =
        new FormControl(this.recipe_in_progress.ingredients[i].ingredient,
          [Validators.required]);
      fg['ingredient_measure_' + i] = new FormControl(
        this.recipe_in_progress.ingredients[i].measure,
        [Validators.required]);
    }

    for (let i = 0; i < this.recipe_in_progress.instructions.length; i++) {
      fg['instruction_' + i] =
        new FormControl(this.recipe_in_progress.instructions[i].instruction,
          [Validators.required]);
      fg['instruction_photo_' + i] = new FormControl(this.recipe_in_progress.instructions[i].photo);
      //          new FormControl(this.recipe_in_progress.instructions[i].photo,
      //            []);
    }
    this.recipeForm = new FormGroup(fg);
  }

  constructor(private recipeService: RecipeService, private router: Router) {
    this.recipe_in_progress = new Recipe(1, '', '', 1, 1, [], [], "", []);
    this.disabled_add_recipe_button = true;
    this.instruction_recipe_photos = [];
    this.cover_photo_for_upload ;
    this.instruction_photo_for_upload = [];
    this.buildRecipeForm();
  }

  readUrl(event:any): void {
    if (event.target.files && event.target.files[0]) {
      const reader:any = new FileReader();

      reader.onload = (rdr:any) => {
        this.cover_photo_for_viewing = reader.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.cover_photo_for_upload = event.target.files[0];

      // setTimeout(() => { console.log('Cover photo:' + this.cover_photo_for_viewing); }, 4000);
    }
  }

  readInstUrl(i: any, event:any): void {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (rdr) => {
        this.instruction_recipe_photos[i] = reader.result;
        console.log('Inside readInstUrl, instruction_recipe_photos[' + i + ']: ' + this.instruction_recipe_photos[i]);
      };
      reader.readAsDataURL(event.target.files[0]);
      this.instruction_photo_for_upload[i] = event.target.files[0];
      //      setTimeout(() => console.log('instruction photo' + this.instruction_recipe_photos[i]));
    }
  }
  ngOnInit() {
  }

  addRecipeClicked() {
    this.recipeService.addRecipe(this.recipe_in_progress,
      {
        cover_photo: this.cover_photo_for_upload,
        instruction_photo: this.instruction_photo_for_upload
      }
    ).then((recipe) =>
      this.router.navigate(['recipes', recipe.id]));
  }

  validateForm(event: any): void {

    this.disabled_add_recipe_button = true;
    console.log(this.recipe_in_progress.title);
    const feeds = parseInt('' + this.recipe_in_progress.feeds_this_many, 10);
    const prepTime = parseInt('' + this.recipe_in_progress.preparation_time, 10);

    if (!this.recipe_in_progress.title ||
      this.recipe_in_progress.title.length < 1) {
      return;
    }
    if (!this.recipe_in_progress.description ||
      this.recipe_in_progress.description.length < 1) {
      return;
    }
    if (!this.recipe_in_progress.preparation_time
      || this.recipe_in_progress.preparation_time < 1) {
      return;
    }

    if (!this.recipe_in_progress.feeds_this_many
      || this.recipe_in_progress.feeds_this_many < 1) {
      return;
    }

    if (isNaN(feeds) || feeds < 1 || feeds > 1000) {
      return;
    }
    if (isNaN(prepTime) || prepTime < 1) {
      return;
    }

    if (this.recipe_in_progress.ingredients &&
      this.recipe_in_progress.ingredients.length > 0) {
      for (const ingr of this.recipe_in_progress.ingredients) {
        if (!ingr.measure || ingr.measure.length < 1 || parseInt(ingr.measure, 10) < 1) {
          console.log('Returning due to ingredient measure');
          return;
        }

        if (!ingr.ingredient || ingr.ingredient.length < 1) {
          console.log('Returning due to ingredient length');
          return;
        }
      }
    }

    if (this.recipe_in_progress.instructions &&
      this.recipe_in_progress.instructions.length > 0) {
      for (const inst of this.recipe_in_progress.instructions) {
        if (!inst.instruction || inst.instruction.length < 1) {
          console.log('Returning due to instruction length');
          return;
        }
      }
    }
    this.disabled_add_recipe_button = false;
    //    console.log(JSON.stringify(event.target.value, null, 2));
  }

  addNewIngredient() {
    if (!this.recipe_in_progress.ingredients) {
      this.recipe_in_progress.ingredients = [{ ingredient: "" , measure: ""}];
    } else {
      this.recipe_in_progress.ingredients.push({ ingredient: "", measure: ""});
    }

    this.buildRecipeForm();

  }

  removeIngredient(ingredient_index: number): void {
    this.recipe_in_progress.ingredients.splice(ingredient_index, 1);
    console.log(this.recipe_in_progress.ingredients.length);
    this.buildRecipeForm();
  }

  addNewInstructions() {
    if (!this.recipe_in_progress.instructions) {
      this.recipe_in_progress.instructions = [{ instruction: "", photo: ""}];
      this.instruction_recipe_photos = [];
      this.instruction_photo_for_upload = [];
      console.log('addNewInstructions a');
    } else {
      this.recipe_in_progress.instructions.push({ instruction: "", photo: ""});
      this.instruction_recipe_photos.push('');
      this.instruction_photo_for_upload.push();
      console.log('addNewInstructions b instruction_recipe_photos length=' + this.instruction_recipe_photos.length);
    }
    console.log('Instruction recipe photo' + this.instruction_recipe_photos);
    this.buildRecipeForm();
  }

  removeInstruction(instruction_index: number): void {
    this.recipe_in_progress.instructions.splice(instruction_index, 1);
    console.log('Instruction length' + this.recipe_in_progress.instructions.length);
    this.instruction_recipe_photos.splice(instruction_index, 1);
    this.instruction_photo_for_upload.splice(instruction_index, 1);
    this.buildRecipeForm();
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
