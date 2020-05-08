import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Csv } from 'src/app/csv';

interface CsvRow {
  child: string;
  parent: string;
  label: string;
  value?: number;
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
    const data = ((this.csv.data as unknown) as CsvRow[]).map(d => {
      d.value = d.label.length;
      return d;
    });
    console.log('data: ', data);
    const stratify = d3
      .stratify<CsvRow>()
      .id(d => d.child)
      .parentId(d => d.parent);
    console.log('stratify: ', stratify);
    const stratifiedData = stratify(data);

    stratifiedData.sum(function (d) {
      return d.value;
    });

    console.log('stratifiedData: ', stratifiedData);

    const hierarchy = d3.hierarchy(stratifiedData);
    console.log('hierarchy: ', hierarchy);

    const treemapLayout = d3
      .treemap<d3.HierarchyNode<CsvRow>>()
      .tile(d3.treemapBinary)
      .size([1500, 2000])
      .padding(20)
      .round(false);

    const root = treemapLayout(hierarchy);
    console.log('root: ', root);

    d3.select('div.content')
      .append('svg')
      .append('g')
      .selectAll('rect')
      .data(root.descendants())
      .enter()
      .append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => {
        return d.y1 - d.y0;
      });

    const nodes = d3
      .select('svg g')
      .selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('transform', d => 'translate(' + [d.x0, d.y0] + ')');

    nodes
      .append('rect')
      .attr('width', d => {
        return d.x1 - d.x0;
      })
      .attr('height', d => d.y1 - d.y0);

    nodes
      .append('text')
      .attr('dx', 4)
      .attr('dy', 14)
      .text(d => d.data.data.label);
  }
}
