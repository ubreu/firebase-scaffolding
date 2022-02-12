import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionViewComponent } from './function-view.component';

describe('FunctionViewComponent', () => {
  let component: FunctionViewComponent;
  let fixture: ComponentFixture<FunctionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
