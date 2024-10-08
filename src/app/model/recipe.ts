import { Ingredient } from './ingredient';
import { Instruction } from './instruction';

export class Recipe {
    public id: number;
    public title: string;
    public description: string;
    public feeds_this_many: number; // people
    public preparation_time: number; // minutes
    public ingredients: Ingredient[];
    public instructions: Instruction[];
    public cover_photo: string;
    public keywords: string[];

    public static inputRecipe(): Recipe {
        return new Recipe(1, '', '', 1, 1, [], [], '', []);
    }

    public static recipeFromJson(obj: any): Recipe {
        return new Recipe(parseInt(obj.id, 10), obj.title, obj.description,
            obj.feeds_this_many,
            obj.preparation_time,
            obj.ingredients,
            obj.instructions,
            obj.cover_photo,
            obj.keywords);
    }

    constructor(id: number,
        t: string,
        d: string, ftm: number, pt: number, ingr: Ingredient[], instr: Instruction[],
        cp: string,
        keywords: string[]) {
        this.id = id;
        this.title = t;
        this.description = d;
        this.feeds_this_many = ftm;
        this.preparation_time = pt;
        this.ingredients = ingr;
        this.instructions = instr;
        this.cover_photo = cp;
        this.keywords = keywords;
    }
}
