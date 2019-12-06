import { AfterContentInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-comp3-doughnut-chart',
  templateUrl: './comp3-doughnut-chart.component.html',
  styleUrls: ['./comp3-doughnut-chart.component.css']
})
export class Comp3DoughnutChartComponent implements OnInit, AfterContentInit {

  width = 450;
  height = 450;
  margin = 40;
  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  radius = Math.min(this.width, this.height) / 2 - this.margin;

  // Create dummy data
  data = { a: 9, b: 20, c: 30, d: 8, e: 12 };

  // set the color scale
  color = d3.scaleOrdinal()
    .domain(this.data)
    .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56']);

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {

// append the svg object to the div called 'my_dataviz'
    const svg = d3.select('#my_dataviz')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

// Compute the position of each group on the pie:
    const pie = d3.pie().value(d => d.value);
    const dataReady = pie(d3.entries(this.data));

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('whatever')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(100)         // This is the size of the donut hole
        .outerRadius(this.radius)
      )
      .attr('fill', d => this.color(d.data.key))
      .attr('stroke', 'black')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);
  }


}
