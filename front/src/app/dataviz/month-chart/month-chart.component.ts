import { Component, OnInit, Input } from '@angular/core';
import { Csv } from 'src/app/csv';

@Component({
  selector: 'app-month-chart',
  templateUrl: './month-chart.component.html',
  styleUrls: ['./month-chart.component.scss'],
})
export class MonthChartComponent implements OnInit {
  @Input() csv: Csv;
  constructor() {}

  ngOnInit(): void {}
}
