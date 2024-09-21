import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewRecipeComponent } from './edit-new-recipe.component';

describe('EditNewRecipeComponent', () => {
  let component: EditNewRecipeComponent;
  let fixture: ComponentFixture<EditNewRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditNewRecipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditNewRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
