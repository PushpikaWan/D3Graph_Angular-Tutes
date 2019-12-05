import { AfterContentInit, Component } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-comp1-red-dot',
  templateUrl: './comp1-red-dot.component.html',
  styleUrls: ['./comp1-red-dot.component.css']
})
export class Comp1RedDotComponent implements AfterContentInit {

  radius = 10;

  ngAfterContentInit() {
    d3.select('p').style('color', 'red');
  }

  colorMe() {
    d3.select('button').style('color', 'red');
  }

  clicked($event: MouseEvent) {
    d3.select($event.target).append('circle')
      .attr('cx', $event.x)
      .attr('cy', $event.y)
      .attr('r', () => {
        return this.radius;
      })
      .attr('fill', 'red');
  }

}
