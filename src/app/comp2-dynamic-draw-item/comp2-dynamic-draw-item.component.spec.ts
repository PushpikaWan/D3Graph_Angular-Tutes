import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp2DynamicDrawItemComponent } from './comp2-dynamic-draw-item.component';

describe('Comp2DynamicDrawItemComponent', () => {
  let component: Comp2DynamicDrawItemComponent;
  let fixture: ComponentFixture<Comp2DynamicDrawItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp2DynamicDrawItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp2DynamicDrawItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
