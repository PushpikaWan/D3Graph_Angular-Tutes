import { AfterContentInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-comp4-time-series-line-chart',
  templateUrl: './comp4-time-series-line-chart.component.html',
  styleUrls: ['./comp4-time-series-line-chart.component.css']
})
export class Comp4TimeSeriesLineChartComponent implements AfterContentInit {

  svg: any;
  margin: any;
  margin2: any;
  width: any;
  height: any;
  height2: any;
  parseDate: any;

  x: any;
  x2: any;
  y: any;
  y2: any;

  xAxis: any;
  xAxis2: any;
  yAxis: any;

  // ////////////////////////////////
  brush: any;
  zoom: any;
  area: any;
  area2: any;
  focus: any;
  context: any;

  constructor() { }

  ngAfterContentInit(): void {

    this.svg = d3.select('svg');
    this.margin = { top: 20, right: 20, bottom: 110, left: 40 };
    this.margin2 = { top: 430, right: 20, bottom: 30, left: 40 };
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.height2 = +this.svg.attr('height') - this.margin2.top - this.margin2.bottom;

    this.parseDate = d3.timeParse('%b %Y');

    this.x = d3.scaleTime().range([0, this.width]);
    this.x2 = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.y2 = d3.scaleLinear().range([this.height2, 0]);

    this.xAxis = d3.axisBottom(this.x);
    this.xAxis2 = d3.axisBottom(this.x2);
    this.yAxis = d3.axisLeft(this.y);

    console.log('dsasdasdasda');

    this.brush = d3.brushX()
      .extent([[0, 0], [this.width, this.height2]])
      .on('brush end', () => {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') {
          return; // ignore brush-by-zoom
        }
        const s = d3.event.selection || this.x2.range();
        console.log('in brushed', this.x, this.x);
        this.x.domain(s.map(this.x2.invert, this.x2));
        this.focus.select('.area').attr('d', this.area);
        this.focus.select('.axis--x').call(this.xAxis);
        this.svg.select('.zoom').call(this.zoom.transform, d3.zoomIdentity
          .scale(this.width / (s[1] - s[0]))
          .translate(-s[0], 0));
      });

    this.zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.width, this.height]])
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', () => {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
          return;
        } // ignore zoom-by-brush
        const t = d3.event.transform;
        // this.x.domain(t.rescaleX(this.x2).domain());
        this.focus.select('.area').attr('d', this.area);
        this.focus.select('.axis--x').call(this.xAxis);
        this.context.select('.brush').call(this.brush.move, this.x.range().map(t.invertX, t));
      });

    this.area = d3.area()
      .curve(d3.curveMonotoneX)
      .x((d) => this.x(d.date))
      .y0(this.height)
      .y1((d) => this.y(d.price));

    this.area2 = d3.area()
      .curve(d3.curveMonotoneX)
      .x((d) => this.x2(d.date))
      .y0(this.height2)
      .y1((d) => this.y2(d.price));

    this.focus = this.svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height);

    this.context = this.svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + this.margin2.left + ',' + this.margin2.top + ')');

    d3.csv('/assets/sp500.csv', (d) => {
      d.date = this.parseDate(d.date);
      d.price = +d.price;
      return d;
    }, (data, error) => {
      console.log('error happened', error);
      console.log('data', data);
      console.log('in x data', this.x.domain);
      // if (error) {
      //   throw error;
      // }

      this.x.domain(d3.extent(data, (d) => d.date));
      this.y.domain([0, d3.max(data, (d) => d.price)]);
      this.x2.domain(this.x.domain());
      this.y2.domain(this.y.domain());

      this.focus.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('d', this.area);

      this.focus.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(this.xAxis);

      this.focus.append('g')
        .attr('class', 'axis axis--y')
        .call(this.yAxis);

      this.context.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('d', this.area2);

      this.context.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + this.height2 + ')')
        .call(this.xAxis2);

      this.context.append('g')
        .attr('class', 'brush')
        .call(this.brush)
        .call(this.brush.move, this.x.range());

      this.svg.append('rect')
        .attr('class', 'zoom')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
        .call(this.zoom);
    });

  }
}

function brushed(x: any) {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') {
    return; // ignore brush-by-zoom
  }
  const s = d3.event.selection || this.x2.range();
  console.log('in brushed', this.x);
  this.x.domain(s.map(this.x2.invert, this.x2));
  this.focus.select('.area').attr('d', this.area);
  this.focus.select('.axis--x').call(this.xAxis);
  this.svg.select('.zoom').call(this.zoom.transform, d3.zoomIdentity
    .scale(this.width / (s[1] - s[0]))
    .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
    return;
  } // ignore zoom-by-brush
  const t = d3.event.transform;
  // this.x.domain(t.rescaleX(this.x2).domain());
  this.focus.select('.area').attr('d', this.area);
  this.focus.select('.axis--x').call(this.xAxis);
  this.context.select('.brush').call(this.brush.move, this.x.range().map(t.invertX, t));
}

function type(d) {
  d.date = this.parseDate(d.date);
  d.price = +d.price;
  return d;
}
