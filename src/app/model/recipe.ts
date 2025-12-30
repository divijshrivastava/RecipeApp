import { Models } from 'appwrite';
import { Ingredient } from './ingredient';
import { Instruction } from './instruction';

export class Recipe {
  public id: string;
  public title: string;
  public description: string;
  public feeds_this_many: number; // people
  public preparation_time: number; // minutes
  public ingredients: Ingredient[];
  public instructions: Instruction[];
  public cover_photo: string;
  public keywords: string[];
  public category?: string;
  public difficulty?: 'Easy' | 'Medium' | 'Hard';
  public created_at?: string;
  public updated_at?: string;

  public static inputRecipe(): Recipe {
    return new Recipe('', '', '', 1, 1, [], [], '', [], 'Uncategorized', 'Medium');
  }

  public static recipeFromJson(obj: any): Recipe {
    return new Recipe(
      obj.id,
      obj.title,
      obj.description,
      obj.feeds_this_many,
      obj.preparation_time,
      obj.ingredients,
      obj.instructions,
      obj.cover_photo,
      obj.keywords
    );
  }

  public static recipeFromDocument(document: Models.Document) {
    const id = document.$id;
    const title = document['title'];
    const description = document['description'];
    const feeds_this_many = document['feeds_this_many'];
    const preparation_time = document['preparation_time'];
    const ingredients: Ingredient[] = document['ingredients'] || [];
    const instructions: Instruction[] = document['instructions'] || [];
    const cover_photo = document['cover_photo'] || '';
    const keywords = document['keywords'] || [];
    const category = document['category'] || 'Uncategorized';
    const difficulty = document['difficulty'] || 'Medium';
    return new Recipe(
      id,
      title,
      description,
      feeds_this_many,
      preparation_time,
      ingredients,
      instructions,
      cover_photo,
      keywords,
      category,
      difficulty
    );
  }

  constructor(
    id: string,
    title: string,
    description: string,
    feeds_this_many: number,
    preparation_time: number,
    ingredients: Ingredient[],
    instructions: Instruction[],
    cover_photo: string,
    keywords: string[],
    category: string = 'Uncategorized',
    difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium'
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.feeds_this_many = feeds_this_many;
    this.preparation_time = preparation_time;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.cover_photo = cover_photo;
    this.keywords = keywords;
    this.category = category;
    this.difficulty = difficulty;
  }
}
