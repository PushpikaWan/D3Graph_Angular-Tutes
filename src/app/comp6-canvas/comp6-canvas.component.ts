import { AfterContentInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-comp6-canvas',
  templateUrl: './comp6-canvas.component.html',
  styleUrls: ['./comp6-canvas.component.css']
})
export class Comp6CanvasComponent implements AfterContentInit {

  constructor() { }

  ngAfterContentInit(): void {

    this.simpleDraw();
  }

  simpleDraw() {
    const base = d3.select('#vis');
    const chart = base.append('canvas')
      .attr('width', 400)
      .attr('height', 300);

    const context = chart.node().getContext('2d');
    const data = [1, 2, 13, 20, 23];

    const scale = d3.scaleLinear()
      .range([10, 390])
      .domain([1, 23]);

    data.forEach((d, i) => {
      context.beginPath();
      context.rect(scale(d), 150, 10, 10);
      context.fillStyle = 'red';
      context.fill();
      context.closePath();
    });
  }
}


