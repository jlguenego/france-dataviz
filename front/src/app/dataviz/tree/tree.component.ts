import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
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
  constructor() {}

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

  }
}
