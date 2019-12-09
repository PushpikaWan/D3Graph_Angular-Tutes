import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp4TimeSeriesLineChartComponent } from './comp4-time-series-line-chart.component';

describe('Comp4TimeSeriesLineChartComponent', () => {
  let component: Comp4TimeSeriesLineChartComponent;
  let fixture: ComponentFixture<Comp4TimeSeriesLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp4TimeSeriesLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp4TimeSeriesLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
