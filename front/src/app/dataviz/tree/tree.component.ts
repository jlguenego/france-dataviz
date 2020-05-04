import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { Csv } from 'src/app/csv';
import * as d3 from 'd3';

interface CsvRow {
  child: string;
  parent: string;
  label: string;
}

interface Root extends d3.HierarchyNode<d3.HierarchyNode<CsvRow>> {
  x0: number;
  y0: number;
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TreeComponent implements OnInit {
  @Input() csv: Csv;
  title = '';
  label = '';
  constructor(private elt: ElementRef) {}

  ngOnInit(): void {
    this.title = this.csv.getCommandValue('title');
    this.refresh();
  }

  refresh() {
    const stratify = d3
      .stratify<CsvRow>()
      .id((d) => d.child)
      .parentId((d) => d.parent);
    console.log('stratify: ', stratify);
    const treeData = stratify((this.csv.data as unknown) as CsvRow[]);
    console.log('treeData: ', treeData);

    const root = d3.hierarchy(treeData);
    console.log('root: ', root);

    const dx = 12;
    const dy = 300;
    const width = 1000;

    const tree = d3.tree().nodeSize([dx, dy]);
    const treeLink = d3
      .linkHorizontal()
      .x((d: any) => d.y)
      .y((d: any) => d.x);

    const node = graph(root, {
      label: (d) => {
        console.log('d: ', d);
        return d.data.data.label;
      },
    });
    (this.elt.nativeElement as Element)
      .querySelector('.content')
      .appendChild(node);

    function graph(
      r: d3.HierarchyNode<unknown>,
      {
        label = (d: any) => d.data.id,
        highlight = (s: any) => false,
        marginLeft = 100,
      } = {}
    ) {
      const root = tree(r);

      let x0 = Infinity;
      let x1 = -x0;
      root.each((d) => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
      });

      const svg = d3
        .create('svg')
        .attr('viewBox', [0, 0, width, x1 - x0 + dx * 2].join(' '))
        .style('overflow', 'visible');

      const g = svg
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('transform', `translate(${marginLeft},${dx - x0})`);

      const link = g
        .append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr('stroke', (d: any) =>
          highlight(d.source) && highlight(d.target) ? 'red' : null
        )
        .attr('stroke-opacity', (d) =>
          highlight(d.source) && highlight(d.target) ? 1 : null
        )
        .attr('d', treeLink as any);

      const node = g
        .append('g')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', (d) => `translate(${d.y},${d.x})`);

      node
        .append('circle')
        .attr('fill', (d) =>
          highlight(d) ? 'red' : d.children ? '#555' : '#999'
        )
        .attr('r', 2.5);

      node
        .append('text')
        .attr('fill', (d) => (highlight(d) ? 'red' : null))
        .attr('dy', '0.31em')
        .attr('x', (d) => (d.children ? -6 : 6))
        .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
        .text(label)
        .clone(true)
        .lower()
        .attr('stroke', 'white');

      return svg.node();
    }
  }
}
