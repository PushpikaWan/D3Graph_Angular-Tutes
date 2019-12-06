import { AfterContentInit, Component, OnInit } from '@angular/core';

import * as d3 from 'd3';


@Component({
  selector: 'app-comp2-dynamic-draw-item',
  templateUrl: './comp2-dynamic-draw-item.component.html',
  styleUrls: ['./comp2-dynamic-draw-item.component.css']
})
export class Comp2DynamicDrawItemComponent implements AfterContentInit {
  constructor() {
  }

  // important - create enough width and height
  drawLine() {
    let svg = d3.select('#svgcontainer').append('svg').attr('width', 1000).attr('height', 1000);
    svg.append('line')
      .attr('x1', 100)
      .attr('y1', 100)
      .attr('x2', 200)
      .attr('y2', 200)
      .style('stroke', 'red')
      .style('stroke-width', 2);

  }

  ngAfterContentInit(): void {
    this.drawLine();
  }


}
