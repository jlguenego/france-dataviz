import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Csv } from 'src/app/csv';
import { Moment } from 'moment';
import * as moment from 'moment';

interface IntervalStruct {
  width: string;
  label: string;
}

const FORMAT = 'YYYYMM';

@Component({
  selector: 'app-month-chart',
  templateUrl: './month-chart.component.html',
  styleUrls: ['./month-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MonthChartComponent implements OnInit {
  @Input() csv: Csv;

  label = '';
  title = '';

  months: Moment[];
  years: IntervalStruct[];

  begin: Moment;
  constructor() {}

  getMonthInitial(m: Moment): string {
    return m.format('M');
  }

  ngOnInit(): void {
    this.buildCalendar();
  }

  buildCalendar(): void {
    const months = this.csv.data.map((d) => +d.month);
    this.begin = moment('' + Math.min(...months), FORMAT);
    const end = moment('' + Math.max(...months), FORMAT);
    const monthDuration = Math.ceil(
      moment.duration(end.diff(this.begin)).asMonths()
    );
    this.months = new Array(monthDuration)
      .fill(0)
      .map((n, i) => this.begin.clone().add(i, 'months'));

    // years
    this.years = [];
    let iday = this.begin;
    while (iday.isBefore(end)) {
      const monthInYear = iday === this.begin ? 12 - iday.month() : 12;

      this.years.push({
        width: `${monthInYear * 2}em`,
        label: iday.format('YYYY'),
      });
      iday = iday.clone().add(1, 'year').month(0).days(3);
    }
    this.years[this.years.length - 1] = {
      width: `${(end.month() + 1) * 2}em`,
      label: iday.format('YYYY'),
    };
  }
}
