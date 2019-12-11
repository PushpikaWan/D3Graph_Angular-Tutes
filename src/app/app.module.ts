import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Comp1RedDotComponent } from './comp1-red-dot/comp1-red-dot.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Comp2DynamicDrawItemComponent } from './comp2-dynamic-draw-item/comp2-dynamic-draw-item.component';
import { Comp3DoughnutChartComponent } from './comp3-doughnut-chart/comp3-doughnut-chart.component';
import { Comp4TimeSeriesLineChartComponent } from './comp4-time-series-line-chart/comp4-time-series-line-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { Comp5ChartInteractionComponent } from './comp5-chart-interaction/comp5-chart-interaction.component';

@NgModule({
  declarations: [
    AppComponent,
    Comp1RedDotComponent,
    Comp2DynamicDrawItemComponent,
    Comp3DoughnutChartComponent,
    Comp4TimeSeriesLineChartComponent,
    Comp5ChartInteractionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
