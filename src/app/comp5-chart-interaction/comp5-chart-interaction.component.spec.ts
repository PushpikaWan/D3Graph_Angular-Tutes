import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp5ChartInteractionComponent } from './comp5-chart-interaction.component';

describe('Comp5ChartInteractionComponent', () => {
  let component: Comp5ChartInteractionComponent;
  let fixture: ComponentFixture<Comp5ChartInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp5ChartInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp5ChartInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
