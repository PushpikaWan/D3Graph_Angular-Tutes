import { AfterContentInit, Component } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-comp5-chart-interaction',
  templateUrl: './comp5-chart-interaction.component.html',
  styleUrls: ['./comp5-chart-interaction.component.css']
})
export class Comp5ChartInteractionComponent implements AfterContentInit {

  constructor() { }

  ngAfterContentInit(): void {
    const freqData = [
      { State: 'AL', freq: { low: 4786, mid: 1319, high: 249 } }
      , { State: 'AZ', freq: { low: 1101, mid: 412, high: 674 } }
      , { State: 'CT', freq: { low: 932, mid: 2149, high: 418 } }
      , { State: 'DE', freq: { low: 832, mid: 1152, high: 1862 } }
      , { State: 'FL', freq: { low: 4481, mid: 3304, high: 948 } }
      , { State: 'GA', freq: { low: 1619, mid: 167, high: 1063 } }
      , { State: 'IA', freq: { low: 1819, mid: 247, high: 1203 } }
      , { State: 'IL', freq: { low: 4498, mid: 3852, high: 942 } }
      , { State: 'IN', freq: { low: 797, mid: 1849, high: 1534 } }
      , { State: 'KS', freq: { low: 162, mid: 379, high: 471 } }
    ];

    dashboard('#dashboard', freqData);
  }
}

function dashboard(id, fData) {
  const barColor = 'steelblue';
  let hG = {};
  let pC = {};
  let leg = {};
  let hGsvg;
  let current;
  let hGUpdate;
  let bars;
  let legendN;
  let pie;
  let arc;
  let piesvg;

  function segColor(c) { return { low: '#807dba', mid: '#e08214', high: '#41ab5d' }[c]; }

  // compute total for each state.
  fData.forEach((d) => d.total = d.freq.low + d.freq.mid + d.freq.high);

  function getLegend(d, aD) { // Utility function to compute percentage.
    return d3.format('%')(d.freq / d3.sum(aD.map((v) => v.freq)));
  }

  // Utility function to be used to update the legend.
  function legUpdate(nD: any) {
    // update the data attached to the row elements.
    const l = legendN.select('tbody').selectAll('tr').data(nD);

    // update the frequencies.
    l.select('.legendFreq').text((d) => d3.format(',')(d.freq));

    // update the percentage column.
    l.select('.legendPerc').text((d) => getLegend(d, nD));
    return {};
  }

  // Animating the pie-slice requiring a custom function which specifies
  // how the intermediate paths should be drawn.
  function arcTween(a) {
    const i = d3.interpolate(current, a);
    current = i(0);
    return (t) => arc(i(t));
  }

  // create function to update pie-chart. This will be used by histogram.
  function pCUpdate(nD) {
    return piesvg.selectAll('path').data(pie(nD)).transition().duration(500).attrTween('d', arcTween);
  }

  // function to handle histogram.
  function histoGram(fD) {
    const hGDim = { t: 60, r: 0, b: 30, l: 0 };
    const hGDimW = 500 - hGDim.l - hGDim.r;
    const hGDimH = 300 - hGDim.t - hGDim.b;

    // create svg for histogram.
    hGsvg = d3.select(id).append('svg')
      .attr('width', hGDimW + hGDim.l + hGDim.r)
      .attr('height', hGDimH + hGDim.t + hGDim.b).append('g')
      .attr('transform', 'translate(' + hGDim.l + ',' + hGDim.t + ')');

    // create function for x-axis mapping.
    const x = d3.scaleBand()
      .rangeRound([0, hGDimW], 0.1)
      .domain(fD.map((d) => d[0]));

    // Add x-axis to the histogram svg.
    hGsvg.append('g').attr('class', 'x axis')
      .attr('transform', 'translate(0,' + hGDimH + ')')
      .call(d3.axisBottom().scale(x));

    // Create function for y-axis map.
    const y = d3.scaleLinear().range([hGDimH, 0])
      .domain([0, d3.max(fD, (d) => d[1])]);

    // Create bars for histogram to contain rectangles and freq labels.
    bars = hGsvg.selectAll('.bar').data(fD).enter()
      .append('g').attr('class', 'bar');

    // create the rectangles.
    bars.append('rect')
      .attr('x', (d) => x(d[0]))
      .attr('y', (d) => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', (d) => hGDimH - y(d[1]))
      .attr('fill', barColor)
      .on('mouseover', mouseover)// mouseover is defined below.
      .on('mouseout', mouseout); // mouseout is defined below.

    // Create the frequency labels above the rectangles.
    bars.append('text').text((d) => d3.format(',')(d[1]))
      .attr('x', (d) => x(d[0]) + x.bandwidth() / 2)
      .attr('y', (d) => y(d[1]) - 5)
      .attr('text-anchor', 'middle');

    function mouseover(d) {  // utility function to be called on mouseover.
      // filter for selected state.
      const st = fData.filter((s) => s.State === d[0])[0];
      // todo to needful
      const nD = d3.keys(st.freq).map((s) => ({ type: s, freq: st.freq[s] }));

      // call update functions of pie-chart and legend
      pC = pCUpdate(nD);
      leg = legUpdate(nD);
    }

    function mouseout(d) {    // utility function to be called on mouseout.
      // reset the pie-chart and legend
      pC = pCUpdate(tF);
      leg = legUpdate(tF);
    }

    // create function to update the bars. This will be used by pie-chart.
    hGUpdate = (nD, color) => {
      // update the domain of the y-axis map to reflect change in frequencies.
      y.domain([0, d3.max(nD, (d) => d[1])]);

      // Attach the new data to the bars.
      bars = hGsvg.selectAll('.bar').data(nD);

      // transition the height and color of rectangles.
      bars.select('rect').transition().duration(500)
        .attr('y', (d) => y(d[1]))
        .attr('height', (d) => hGDimH - y(d[1]))
        .attr('fill', color);

      // transition the frequency labels location and change value.
      bars.select('text').transition().duration(500)
        .text((d) => d3.format(',')(d[1]))
        .attr('y', (d) => y(d[1]) - 5);
    };
    return hG;
  }

  // function to handle pieChart.
  function pieChart(pD) {
    const pieDim = { w: 250, h: 250 };
    const pieDimR = Math.min(pieDim.w, pieDim.h) / 2;

    // create svg for pie chart.
    piesvg = d3.select(id).append('svg')
      .attr('width', pieDim.w).attr('height', pieDim.h).append('g')
      .attr('transform', 'translate(' + pieDim.w / 2 + ',' + pieDim.h / 2 + ')');

    // create function to draw the arcs of the pie slices.
    arc = d3.arc().outerRadius(pieDimR - 10).innerRadius(0);

    // create a function to compute the pie slice angles.
    pie = d3.pie().sort(null).value((d) => d.freq);

    // Draw the pie slices.
    piesvg.selectAll('path').data(pie(pD)).enter().append('path').attr('d', arc)
      .each((d) => { current = d; })
      .style('fill', (d) => segColor(d.data.type))
      .on('mouseover', mouseover).on('mouseout', mouseout);

    // Utility function to be called on mouseover a pie slice.
    function mouseover(d) {
      // call the update function of histogram with new data.
      hGUpdate(fData.map((v) => {
        return [v.State, v.freq[d.data.type]];
      }), segColor(d.data.type));
    }

    // Utility function to be called on mouseout a pie slice.
    function mouseout(d) {
      // call the update function of histogram with all data.
      hGUpdate(fData.map((v) => {
        return [v.State, v.total];
      }), barColor);
    }


    return pC;
  }

  // function to handle legend.
  function legend(lD) {

    // create table for legend.
    legendN = d3.select(id).append('table').attr('class', 'legend');

    // create one row per segment.
    const tr = legendN.append('tbody').selectAll('tr').data(lD).enter().append('tr');

    // create the first column for each segment.
    tr.append('td').append('svg').attr('width', '16').attr('height', '16').append('rect')
      .attr('width', '16').attr('height', '16')
      .attr('fill', (d) => segColor(d.type));

    // create the second column for each segment.
    tr.append('td').text((d) => d.type);

    // create the third column for each segment.
    tr.append('td').attr('class', 'legendFreq')
      .text((d) => d3.format(',')(d.freq));

    // create the fourth column for each segment.
    tr.append('td').attr('class', 'legendPerc')
      .text((d) => getLegend(d, lD));

    return leg;
  }

  // calculate total frequency by segment for all state.
  const tF = ['low', 'mid', 'high'].map((d) => {
    return { type: d, freq: d3.sum(fData.map((t) => t.freq[d])) };
  });

  // calculate total frequency by state for all segment.
  const sF = fData.map((d) => [d.State, d.total]);

  hG = histoGram(sF); // create the histogram.
  pC = pieChart(tF); // create the pie-chart.
  leg = legend(tF);  // create the legend.
}
