import { Component, OnInit, Input } from '@angular/core';
import { Csv } from 'src/app/csv';

@Component({
  selector: 'app-treemap',
  templateUrl: './treemap.component.html',
  styleUrls: ['./treemap.component.scss'],
})
export class TreemapComponent implements OnInit {
  @Input() csv: Csv;
  constructor() {}

  ngOnInit(): void {}
}
