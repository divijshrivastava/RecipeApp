import { Ingredient } from './ingredient';
import { Instruction } from './instruction';

export class Recipe {
    public title: string;
    public description: string;
    public feeds_this_many: number; // people
    public preparation_time: number; // minutes
    public ingredients: Ingredient[];
    public instructions: Instruction[];
    public cover_photo: string;

    public static inputRecipe(): Recipe {
        return new Recipe('', '', 1, 1, null, null, null);
    }



    constructor(t: string, d: string, ftm: number, pt: number, ingr: Ingredient[], instr: Instruction[], cp: string) {
        this.title = t;
        this.description = d;
        this.feeds_this_many = ftm;
        this.preparation_time = pt;
        this.ingredients = ingr;
        this.instructions = instr;
        this.cover_photo = cp;
    }
}
