import { Ingredient } from './ingredient';
import { Instruction } from './instruction';

export class Recipe {
    public title: string;
    public description: string;
    public ingredients: Ingredient[];
    public instructions: Instruction[];
    public cover_photo: string;

    constructor(t: string, d: string, ingr: Ingredient[], instr: Instruction[], cp: string) {
        this.title = t;
        this.description = d;
        this.ingredients = ingr;
        this.instructions = instr;
        this.cover_photo = cp;
    }
}
