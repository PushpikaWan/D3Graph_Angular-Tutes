import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp1RedDotComponent } from './comp1-red-dot.component';

describe('Comp1RedDotComponent', () => {
  let component: Comp1RedDotComponent;
  let fixture: ComponentFixture<Comp1RedDotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp1RedDotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp1RedDotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
