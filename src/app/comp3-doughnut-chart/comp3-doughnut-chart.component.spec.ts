import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp3DoughnutChartComponent } from './comp3-doughnut-chart.component';

describe('Comp3DoughnutChartComponent', () => {
  let component: Comp3DoughnutChartComponent;
  let fixture: ComponentFixture<Comp3DoughnutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp3DoughnutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp3DoughnutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
