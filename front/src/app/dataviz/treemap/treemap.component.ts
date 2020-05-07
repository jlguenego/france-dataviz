import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Csv } from 'src/app/csv';
import * as d3 from 'd3';

interface CsvRow {
  child: string;
  parent: string;
  label: string;
  value?: number;
  x0?: number;
}

@Component({
  selector: 'app-treemap',
  templateUrl: './treemap.component.html',
  styleUrls: ['./treemap.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TreemapComponent implements OnInit {
  @Input() csv: Csv;
  title = '';
  label = '';
  constructor() {}

  ngOnInit(): void {
    this.title = this.csv.getCommandValue('title');
    this.refresh();
  }

  async refresh() {
    // const data = ((this.csv.data as unknown) as CsvRow[]).map(d => {
    //   d.value = 10;
    //   return d;
    // });
    const data = (this.csv.data as unknown) as CsvRow[];
    console.log('data: ', data);
    const stratify = d3
      .stratify<CsvRow>()
      .id((d) => d.child)
      .parentId((d) => d.parent);
    console.log('stratify: ', stratify);
    const stratifiedData = stratify(data);

    stratifiedData.sum(function (d) {
      return d.value || 100;
    });

    console.log('stratifiedData: ', stratifiedData);

    const root = d3.hierarchy(stratifiedData);
    console.log('root: ', root);

    const treemapLayout = d3.treemap();
    treemapLayout.size([1000, 1000]).padding(20);

    treemapLayout(root);
    console.log('root: ', root);

    d3.select('div.content')
      .append('svg')
      .append('g')
      .selectAll('rect')
      .data(root.descendants())
      .enter()
      .append('rect')
      .attr('x', function (d: any) {
        // console.log('d: ', d);
        return d.x0;
      })
      .attr('y', function (d: any) {
        return d.y0;
      })
      .attr('width', function (d: any) {
        return d.x1 - d.x0;
      })
      .attr('height', function (d: any) {
        return d.y1 - d.y0;
      });

    var nodes = d3
      .select('svg g')
      .selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('transform', function (d: any) {
        return 'translate(' + [d.x0, d.y0] + ')';
      });

    nodes
      .append('rect')
      .attr('width', function (d: any) {
        return d.x1 - d.x0;
      })
      .attr('height', function (d: any) {
        return d.y1 - d.y0;
      });

    nodes
      .append('text')
      .attr('dx', 4)
      .attr('dy', 14)
      .text(function (d) {
        return d.data.data.label;
      });
  }
}
