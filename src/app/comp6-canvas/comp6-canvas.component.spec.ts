import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp6CanvasComponent } from './comp6-canvas.component';

describe('Comp6CanvasComponent', () => {
  let component: Comp6CanvasComponent;
  let fixture: ComponentFixture<Comp6CanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp6CanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp6CanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
