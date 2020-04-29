import { Component, OnInit, Input } from '@angular/core';
import { Csv } from 'src/app/csv';

import * as moment from 'moment';
import { Moment } from 'moment';

const FORMAT = 'YYYYMMDD';

interface MonthStruct {
  width: string;
  label: string;
}

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})
export class PlanningComponent implements OnInit {
  @Input() csv: Csv;
  days: Moment[];
  months: MonthStruct[];
  constructor() {}

  ngOnInit(): void {
    this.getDays();
  }

  getDayOfMonth(d: Moment) {
    return d.format('DD');
  }

  getDayOfWeek(d: Moment) {
    return d.format('dd').substr(0, 1);
  }

  getDays(): void {
    const dates = this.csv.data.map((d) => +d.date);
    console.log('dates: ', dates);
    const begin = moment('' + Math.min(...dates), FORMAT);
    const end = moment('' + Math.max(...dates), FORMAT);
    const days = Math.ceil(moment.duration(end.diff(begin)).asDays());
    console.log('days: ', days);
    this.days = new Array(days)
      .fill(0)
      .map((n, i) => begin.clone().add(i, 'days'));
    console.log('this.days: ', this.days);

    // months
    this.months = [];
    let iday = begin;
    while (iday.isBefore(end)) {
      console.log('iday: ', iday);
      console.log('day in month', iday.daysInMonth());
      const dayInMonth = (iday === begin) ? iday.daysInMonth() - iday.day() - 1 : iday.daysInMonth();

      this.months.push({
        width: `${dayInMonth * 2}em`,
        label: iday.format('MMMM YYYY'),
      });
      iday = iday.clone().add(1, 'months');
    }
    this.months[this.months.length - 1] = {
      width: `${(iday.day() + 1) * 2}em`,
      label: iday.format('MMMM YYYY'),
    };
  }

  isWeekEnd(d: Moment) {
    return [0, 6].includes(d.weekday());
  }
}
