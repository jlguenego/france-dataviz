import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Csv } from 'src/app/csv';
import * as d3 from 'd3';

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
    const data = this.csv.data;
    console.log('data: ', data);

    const stratify = d3
      .stratify()
      .id((d: d3.DSVRowString) => d.child)
      .parentId((d: d3.DSVRowString) => d.parent);
    console.log('stratify: ', stratify);
    const tree = stratify(data);
    console.log('tree: ', tree);

    const treeData = [
      {
        name: 'Top Level',
        parent: 'null',
        children: [
          {
            name: 'Level 2: A',
            parent: 'Top Level',
            children: [
              {
                name: 'Son of A',
                parent: 'Level 2: A',
              },
              {
                name: 'Daughter of A',
                parent: 'Level 2: A',
              },
            ],
          },
          {
            name: 'Level 2: B',
            parent: 'Top Level',
          },
        ],
      },
    ];
    console.log('treeData: ', treeData);
  }
}
