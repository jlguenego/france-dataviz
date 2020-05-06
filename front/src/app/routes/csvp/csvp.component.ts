import { Component, OnInit } from '@angular/core';
import { Csv, CsvType } from 'src/app/csv';
import { ActivatedRoute } from '@angular/router';
import { StateService } from 'src/app/state.service';
import { validURL } from 'src/app/misc';

const DEFAULT_URL =
  'https://jlg-consulting.com/dataviz/jlg_consulting_france_clients.csvp';

@Component({
  selector: 'app-csvp',
  templateUrl: './csvp.component.html',
  styleUrls: ['./csvp.component.scss'],
})
export class CsvpComponent implements OnInit {
  CSV_TYPE_TREE = CsvType.TREE;
  CSV_TYPE_TREEMAP = CsvType.TREEMAP;

  isMap = false;
  isPlanning = false;
  isMonthChart = false;
  csv: Csv;
  constructor(private route: ActivatedRoute, private state: StateService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (qp) => {
      if (!qp.internal) {
        this.state.setCsvpFilename(validURL(qp.url) ? qp.url : DEFAULT_URL);
        await this.state.loadFileFromURL();
      }
      this.csv = new Csv();
      this.isMap = this.csv.getType() === CsvType.MAP;
      this.isPlanning = this.csv.getType() === CsvType.PLANNING;
      this.isMonthChart = this.csv.getType() === CsvType.MONTH_CHART;
    });
  }
}
