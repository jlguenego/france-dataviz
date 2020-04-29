import { Component, OnInit, Input } from '@angular/core';
import { Csv } from 'src/app/csv';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})
export class PlanningComponent implements OnInit {
  @Input() csv: Csv;
  constructor() {}

  ngOnInit(): void {}
}
