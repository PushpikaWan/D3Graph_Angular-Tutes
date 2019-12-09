import { AfterContentInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';


@Component({
  selector: 'app-comp4-time-series-line-chart',
  templateUrl: './comp4-time-series-line-chart.component.html',
  styleUrls: ['./comp4-time-series-line-chart.component.css']
})
export class Comp4TimeSeriesLineChartComponent implements AfterContentInit {

  metricName = 'views';
  metricCount = [1, 3, 1, 2, 1, 1, 1, 1, 2, 2, 3, 1, 2, 1, 4, 3, 2, 1, 1, 1, 1, 1, 4, 2, 1, 2, 8, 2, 1, 4, 2, 4, 1, 3, 1, 2, 1, 1, 3, 1, 1,
    5, 1, 1, 4];
  metricMonths = ['2018-06', '2013-04', '2015-11', '2012-10', '2014-09', '2014-02', '2016-02', '2016-04', '2016-06', '2014-12', '2013-07',
    '2017-01', '2015-10', '2012-12', '2013-05', '2018-04', '2015-06', '2017-03', '2014-08', '2017-07', '2013-02', '2012-07', '2016-03',
    '2017-06', '2018-07', '2014-10', '2013-01', '2013-10', '2017-11', '2014-05', '2012-11', '2015-01', '2018-03', '2015-12', '2015-08',
    '2016-08', '2014-11', '2014-01', '2013-06', '2012-08', '2015-09', '2016-07', '2013-03', '2012-09', '2016-05'];
  optwidth = 600;
  optheight = 370;


  constructor() { }

  ngAfterContentInit(): void {
    const dataset = [];
    for (let i = 0; i < this.metricCount.length; i++) {
      const obj = { count: this.metricCount[i], month: this.metricMonths[i] };
      dataset.push(obj);
    }

// format month as a date
    dataset.forEach((d) => d.month = d3.time.format('%Y-%m').parse(d.month));

// sort dataset by month
    dataset.sort((xx, yy) => d3.ascending(xx.month, yy.month));


    /*
    * ========================================================================
    *  sizing
    * ========================================================================
    */

    /* === Focus chart === */

    const margin = { top: 20, right: 30, bottom: 100, left: 20 };
    const width = this.optwidth - margin.left - margin.right;
    const height = this.optheight - margin.top - margin.bottom;

    /* === Context chart === */

    const marginContext = { top: 320, right: 30, bottom: 20, left: 20 };
    const heightContext = this.optheight - marginContext.top - marginContext.bottom;

    /*
    * ========================================================================
    *  x and y coordinates
    * ========================================================================
    */

// the date range of available data:
    const dataXrange = d3.extent(dataset, (d) => d.month);
    const dataYrange = [0, d3.max(dataset, (d) => d.count)];

// maximum date range allowed to display
    const mindate = dataXrange[0];
    const maxdate = dataXrange[1];

    const DateFormat = d3.time.format('%b %Y');

    const dynamicDateFormat = timeFormat([
      [d3.time.format('%Y'), () => true], // <-- how to display when Jan 1 YYYY
      [d3.time.format('%b %Y'), (d) => d.getMonth()],
      [() => '', (d) => (d.getDate() !== 1)]]);

// var dynamicDateFormat =  timeFormat([
//     [d3.time.format("%Y"), function() { return true; }],
//     [d3.time.format("%b"), function(d) { return d.getMonth(); }],
//     [function(){return "";}, function(d) { return d.getDate() != 1; }]
// ]);

    /* === Focus Chart === */

    const x = d3.time.scale()
      .range([0, (width)])
      .domain(dataXrange);

    const y = d3.scale.linear()
      .range([height, 0])
      .domain(dataYrange);

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickSize(-(height))
      .ticks(customTickFunction)
      .tickFormat(dynamicDateFormat);

    const yAxis = d3.svg.axis()
      .scale(y)
      .ticks(4)
      .tickSize(-(width))
      .orient('right');

    /* === Context Chart === */

    const x2 = d3.time.scale()
      .range([0, width])
      .domain([mindate, maxdate]);

    const y2 = d3.scale.linear()
      .range([heightContext, 0])
      .domain(y.domain());

    const xAxisContext = d3.svg.axis()
      .scale(x2)
      .orient('bottom')
      .ticks(customTickFunction)
      .tickFormat(dynamicDateFormat);

    /*
    * ========================================================================
    *  Plotted line and area variables
    * ========================================================================
    */

    /* === Focus Chart === */

    const line = d3.svg.line()
      .x((d) => x(d.month))
      .y((d) => y(d.count));

    const area = d3.svg.area()
      .x((d) => x(d.month))
      .y0((height))
      .y1((d) => y(d.count));

    /* === Context Chart === */

    const areaContext = d3.svg.area()
      .x((d) => x2(d.month))
      .y0((heightContext))
      .y1((d) => y2(d.count));

    const lineContext = d3.svg.line()
      .x((d) => x2(d.month))
      .y((d) => y2(d.count));

    /*
    * ========================================================================
    *  Variables for brushing and zooming behaviour
    * ========================================================================
    */

    const brush = d3.svg.brush()
      .x(x2)
      .on('brush', brushed)
      .on('brushend', brushend);

    const zoom = d3.behavior.zoom()
      .on('zoom', draw)
      .on('zoomend', brushend);

    /*
    * ========================================================================
    *  Define the SVG area ("vis") and append all the layers
    * ========================================================================
    */

// === the main components === //

    const vis = d3.select('#metric-modal').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'metric-chart'); // CB -- "line-chart" -- CB //

    vis.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);
    // clipPath is used to keep line and area from moving outside of plot area when user zooms/scrolls/brushes

    const context = vis.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + marginContext.left + ',' + marginContext.top + ')');

    const focus = vis.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const rect = vis.append('svg:rect')
      .attr('class', 'pane')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom)
      .call(draw);

// === current date range text & zoom buttons === //

    const displayRangeGroup = vis.append('g')
      .attr('id', 'buttons_group')
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

    // let explText = displayRangeGroup.append('text')
    //   .text('Showing data from: ')
    //   .style('text-anchor', 'start')
    //   .attr('transform', 'translate(' + 0 + ',' + 10 + ')');

    displayRangeGroup.append('text')
      .attr('id', 'displayDates')
      .text(DateFormat(dataXrange[0]) + ' - ' + DateFormat(dataXrange[1]))
      .style('text-anchor', 'start')
      .attr('transform', 'translate(' + 82 + ',' + 10 + ')');

    const explText = displayRangeGroup.append('text')
      .text('Zoom to: ')
      .style('text-anchor', 'start')
      .attr('transform', 'translate(' + 180 + ',' + 10 + ')');

// === the zooming/scaling buttons === //

    const buttonWidth = 40;
    const buttonHeight = 14;

// don't show year button if < 1 year of data
    const dateRange = dataXrange[1] - dataXrange[0];
    const msInYear = 31540000000;
    let buttonData;
    if (dateRange < msInYear) {
      buttonData = ['month', 'data'];
    } else {
      buttonData = ['year', 'month', 'data'];
    }

    const button = displayRangeGroup.selectAll('g')
      .data(buttonData)
      .enter().append('g')
      .attr('class', 'scale_button')
      .attr('transform', (d, i) => 'translate(' + (220 + i * buttonWidth + i * 10) + ',0)')
      .on('click', scaleDate);

    button.append('rect')
      .attr('width', buttonWidth)
      .attr('height', buttonHeight)
      .attr('rx', 1)
      .attr('ry', 1);

    button.append('text')
      .attr('dy', (buttonHeight / 2 + 3))
      .attr('dx', buttonWidth / 2)
      .style('text-anchor', 'middle')
      .text((d) => d);

    /* === focus chart === */

    focus.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .attr('transform', 'translate(' + (width) + ', 0)');

    focus.append('path')
      .datum(dataset)
      .attr('class', 'area')
      .attr('d', area);

    focus.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    focus.append('path')
      .datum(dataset)
      .attr('class', 'line')
      .attr('d', line);

    /* === context chart === */

    context.append('path')
      .datum(dataset)
      .attr('class', 'area')
      .attr('d', areaContext);

    context.append('path')
      .datum(dataset)
      .attr('class', 'line')
      .attr('d', lineContext);

    context.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + heightContext + ')')
      .call(xAxisContext);

    /* === brush (part of context chart)  === */

    const brushg = context.append('g')
      .attr('class', 'x brush')
      .call(brush);

    brushg.selectAll('.extent')
      .attr('y', -6)
      .attr('height', heightContext + 8);
    // .extent is the actual window/rectangle showing what's in focus

    brushg.selectAll('.resize')
      .append('rect')
      .attr('class', 'handle')
      .attr('transform', 'translate(0,' + -3 + ')')
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('height', heightContext + 6)
      .attr('width', 3);

    brushg.selectAll('.resize')
      .append('rect')
      .attr('class', 'handle-mini')
      .attr('transform', 'translate(-2,8)')
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('height', (heightContext / 2))
      .attr('width', 7);
    // .resize are the handles on either size
    // of the 'window' (each is made of a set of rectangles)

    /* === y axis title === */

    vis.append('text')
      .attr('class', 'y axis title')
      .text('Monthly ' + this.metricName)
      .attr('x', (-(height / 2)))
      .attr('y', 0)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'middle');

// allows zooming before any brush action
    zoom.x(x);
  }
}

/*
* ========================================================================
*  Functions
* ========================================================================
*/

// === tick/date formatting functions ===
// from: https://stackoverflow.com/questions/20010864/d3-axis-labels-become-too-fine-grained-when-zoomed-in

function timeFormat(formats) {
  return (date) => {
    let i = formats.length - 1;
    let f = formats[i];
    while (!f[1](date)) {
      f = formats[--i];
    }
    return f[0](date);
  };
}

function customTickFunction(t0, t1, dt) {
  const labelSize = 42; //
  const maxTotalLabels = Math.floor(this.width / labelSize);

  function step(date, offset) {
    date.setMonth(date.getMonth() + offset);
  }

  const time = d3.time.month.ceil(t0);
  let times = [];
  const monthFactors = [1, 3, 4, 12];

  while (time < t1) {
    times.push(new Date(+time)), step(time, 1);
  }
  const timesCopy = times;
  let i;
  for (i = 0; times.length > maxTotalLabels; i++) {
    times = _.filter(timesCopy, (d) => (d.getMonth()) % monthFactors[i] === 0);
  }
  return times;
}

// === brush and zoom functions ===

function brushed() {

  this.x.domain(this.brush.empty() ? this.x2.domain() : this.brush.extent());
  this.focus.select('.area').attr('d', this.area);
  this.focus.select('.line').attr('d', this.line);
  this.focus.select('.x.axis').call(this.xAxis);
  // Reset zoom scale's domain
  this.zoom.x(this.x);
  updateDisplayDates();
  setYdomain();

}

function draw() {
  setYdomain();
  this.focus.select('.area').attr('d', this.area);
  this.focus.select('.line').attr('d', this.line);
  this.focus.select('.x.axis').call(this.xAxis);
  // focus.select(".y.axis").call(yAxis);
  // Force changing brush range
  this.brush.extent(this.x.domain());
  this.vis.select('.brush').call(this.brush);
  // and update the text showing range of dates.
  updateDisplayDates();
}

function brushend() {
// when brush stops moving:

  // check whether chart was scrolled out of bounds and fix,
  let b = this.brush.extent();
  const outOfBounds = this.brush.extent().some((e) => (e < this.mindate || e > this.maxdate));
  if (outOfBounds) { b = moveInBounds(b); }

}

function updateDisplayDates() {

  const b = this.brush.extent();
  // update the text that shows the range of displayed dates
  const localBrushDateStart = (this.brush.empty()) ? this.DateFormat(this.dataXrange[0]) : this.DateFormat(b[0]);
  const localBrushDateEnd = (this.brush.empty()) ? this.DateFormat(this.dataXrange[1]) : this.DateFormat(b[1]);

  // Update start and end dates in upper right-hand corner
  d3.select('#displayDates')
    .text(localBrushDateStart === localBrushDateEnd ? localBrushDateStart : localBrushDateStart + ' - ' + localBrushDateEnd);
}

function moveInBounds(b) {
// move back to boundaries if user pans outside min and max date.

  const msInYear = 31536000000;
  let brushStartNew;
  let brushEndNew;

  if (b[0] < this.mindate) { brushStartNew = this.mindate; } else if (b[0] > this.maxdate) {
    brushStartNew = new Date(this.maxdate.getTime() - msInYear);
  } else { brushStartNew = b[0]; }

  if (b[1] > this.maxdate) { brushEndNew = this.maxdate; } else if (b[1] < this.mindate) {
    brushEndNew = new Date(this.mindate.getTime() + msInYear);
  } else { brushEndNew = b[1]; }

  this.brush.extent([brushStartNew, brushEndNew]);

  this.brush(d3.select('.brush').transition());
  brushed();
  draw();
  return (this.brush.extent());
}

function setYdomain() {
// this function dynamically changes the y-axis to fit the data in focus

  // get the min and max date in focus
  const xLeft = new Date(this.x.domain()[0]);
  const xRight = new Date(this.x.domain()[1]);

  // a function that finds the nearest point to the right of a point
  const bisectDate = d3.bisector((d) => d.month).right;

  // get the y value of the line at the left edge of view port:
  const iL = bisectDate(this.dataset, xLeft);

  if (this.dataset[iL] !== undefined && this.dataset[iL - 1] !== undefined) {

    const leftDateBefore = this.dataset[iL - 1].month;
    const leftDateAfter = this.dataset[iL].month;

    const intfun = d3.interpolateNumber(this.dataset[iL - 1].count, this.dataset[iL].count);
    const yleft = intfun((this.xLeft - leftDateBefore) / (leftDateAfter - leftDateBefore));
  } else {
    const yleft = 0;
  }

  // get the x value of the line at the right edge of view port:
  const iR = bisectDate(this.dataset, xRight);

  if (this.dataset[iR] !== undefined && this.dataset[iR - 1] !== undefined) {

    const rightDateBefore = this.dataset[iR - 1].month;
    const rightDateAfter = this.dataset[iR].month;

    const intfun = d3.interpolateNumber(this.dataset[iR - 1].count, this.dataset[iR].count);
    const yright = intfun((this.xRight - rightDateBefore) / (rightDateAfter - rightDateBefore));
  } else {
    const yright = 0;
  }

  // get the y values of all the actual data points that are in view
  const dataSubset = this.dataset.filter((d) => d.month >= xLeft && d.month <= xRight);
  const countSubset = [];
  dataSubset.map((d) => countSubset.push(d.count));

  // add the edge values of the line to the array of counts in view, get the max y;
  countSubset.push(this.yleft);
  countSubset.push(this.yright);
  let ymaxNew = d3.max(countSubset);

  if (ymaxNew === 0) {
    ymaxNew = this.dataYrange[1];
  }

  // reset and redraw the yaxis
  this.y.domain([0, ymaxNew * 1.05]);
  this.focus.select('.y.axis').call(this.yAxis);

}

function scaleDate(d, i) {
// action for buttons that scale focus to certain time interval

  const b = this.brush.extent();
  let intervalMs;
  let brushEndNew;
  let brushStartNew;

  if (d === 'year') { intervalMs = 31536000000; } else if (d === 'month') { intervalMs = 2592000000; }

  if (d === 'year' || d === 'month') {

    if ((this.maxdate.getTime() - b[1].getTime()) < intervalMs) {
      // if brush is too far to the right that increasing the right-hand brush boundary would make the chart go out of bounds....
      brushStartNew = new Date(this.maxdate.getTime() - intervalMs); // ...then decrease the left-hand brush boundary...
      brushEndNew = this.maxdate; // ...and set the right-hand brush boundary to the maxiumum limit.
    } else {
      // otherwise, increase the right-hand brush boundary.
      brushStartNew = b[0];
      brushEndNew = new Date(b[0].getTime() + intervalMs);
    }

  } else if (d === 'data') {
    brushStartNew = this.dataXrange[0];
    brushEndNew = this.dataXrange[1];
  } else {
    brushStartNew = b[0];
    brushEndNew = b[1];
  }

  this.brush.extent([brushStartNew, brushEndNew]);

  // now draw the brush to match our extent
  this.brush(d3.select('.brush').transition());
  // now fire the brushstart, brushmove, and brushend events
  this.brush.event(d3.select('.brush').transition());
}

