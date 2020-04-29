import { Component, OnInit, Input } from '@angular/core';
import { Csv } from 'src/app/csv';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})
export class PlanningComponent implements OnInit {
  @Input() csv: Csv;
  days = ['20200310', '20200311', '20200312'];
  constructor() {}

  ngOnInit(): void {}

  getDay(d: string) {
    return d.substr(6);
  }
}
