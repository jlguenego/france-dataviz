import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Csv } from 'src/app/csv';

interface CsvRow {
  child: string;
  parent: string;
  label: string;
  description?: string;
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
    const stratify = d3
      .stratify<CsvRow>()
      .id(d => d.child)
      .parentId(d => d.parent);
    const stratifiedData = stratify((this.csv.data as unknown) as CsvRow[]);
    console.log('stratifiedData: ', stratifiedData);

    const hierarchy = d3.hierarchy(stratifiedData);
    console.log('hierarchy: ', hierarchy);

    function getColor(node: d3.HierarchyNode<d3.HierarchyNode<CsvRow>>) {
      // switch (node.depth) {
      //   case 0:
      //     return 240;
      //   case 1:
      //     return 240;
      //   case 2:
      //     return 0;
      //   default:
      //     return 0;
      // }
      return 240;
    }

    function render(
      node: d3.HierarchyNode<d3.HierarchyNode<CsvRow>>,
      dom: HTMLElement
    ) {
      const hue = getColor(node);
      const description = node.data.data.description;
      const label = description
        ? `<div>${node.data.data.label}</div><div class="description">(${node.data.data.description})</div>`
        : `${node.data.data.label}`;
      const domNode = document.createElement('div');
      domNode.classList.add('node');
      domNode.style.background = `hsla(${hue}, 100%, 80%, 0.2)`;
      domNode.style.border = `0.1em solid hsla(${hue}, 100%, 50%, 0.2)`;
      domNode.innerHTML = `<div class="label">${label}</div>`;
      dom.appendChild(domNode);
      if (!node.children) {
        return;
      }
      if (node.children.length === 0) {
        return;
      }
      const childrenElem = document.createElement('div');
      childrenElem.classList.add('children');
      domNode.appendChild(childrenElem);
      for (let child of node.children) {
        render(child, childrenElem);
      }
    }

    render(hierarchy, document.querySelector('div.content'));
  }
}
