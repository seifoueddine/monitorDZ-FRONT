import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditArticleComponent } from './edit-article.component';

describe('EditArticleComponent', () => {
  let component: EditArticleComponent;
  let fixture: ComponentFixture<EditArticleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
