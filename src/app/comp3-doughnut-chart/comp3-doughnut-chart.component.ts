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

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    this.createSimpleDoughNutChart();
    this.createDoughNutChartWithLabels();
  }

  private createSimpleDoughNutChart() {

    // Create dummy data
    const data = { a: 9, b: 20, c: 30, d: 8, e: 12 };

    // set the color scale
    const color = d3.scaleOrdinal().domain(data).range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56']);

    // append the svg object to the div called 'graph_view'
    const svg = d3.select('#graph_view')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

// Compute the position of each group on the pie:
    const pie = d3.pie().value(d => d.value);
    const dataReady = pie(d3.entries(data));

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
      .attr('fill', d => color(d.data.key))
      .attr('stroke', 'black')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);
  }


  private createDoughNutChartWithLabels() {

    // Create dummy data
    const data = { a: 9, b: 20, c: 30, d: 8, e: 12, f: 3, g: 7, h: 14 };

// set the color scale
    const color = d3.scaleOrdinal()
      .domain(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])
      .range(d3.schemeDark2);

    // append the svg object to the div called 'graph_view'
    const svg = d3.select('#graph_view')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

    // Compute the position of each group on the pie:
    const pie = d3.pie()
      .sort(null) // Do not sort group by size
      .value(d => d.value);
    const dataReady = pie(d3.entries(data));

    // The arc generator
    const arc = d3.arc()
      .innerRadius(this.radius * 0.5)         // This is the size of the donut hole
      .outerRadius(this.radius * 0.8);

// Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3.arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('allSlices')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.key))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    // Add the polylines between chart and labels:
    svg
      .selectAll('allPolylines')
      .data(dataReady)
      .enter()
      .append('polyline')
      .attr('stroke', 'black')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', d => {
        const posA = arc.centroid(d); // line insertion in the slice
        const posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        const posC = outerArc.centroid(d); // Label position = almost the same as posB
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the
        // extreme right or extreme left
        posC[0] = this.radius * 0.95 * (midAngle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC];
      });

    svg
      .selectAll('allLabels')
      .data(dataReady)
      .enter()
      .append('text')
      .text(d => {
        console.log(d.data.key);
        return d.data.key;
      })
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = this.radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
      })
      .style('text-anchor', d => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return (midAngle < Math.PI ? 'start' : 'end');
      });

  }
}
