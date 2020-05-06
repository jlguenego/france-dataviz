import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Csv } from 'src/app/csv';

interface CsvRow {
  child: string;
  parent: string;
  label: string;
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

  async refresh() {}
}
