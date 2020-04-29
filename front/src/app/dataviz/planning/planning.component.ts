import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { Csv } from 'src/app/csv';

import * as moment from 'moment';
import { Moment } from 'moment';
import * as d3 from 'd3';

const FORMAT = 'YYYYMMDD';

interface IntervalStruct {
  width: string;
  label: string;
}

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlanningComponent implements OnInit {
  @Input() csv: Csv;
  begin: Moment;
  days: Moment[];
  months: IntervalStruct[];
  weeks: IntervalStruct[];

  scale = 1;

  color = 'green';
  label = '';
  title = '';
  constructor(private elt: ElementRef) {}

  ngOnInit(): void {
    this.buildCalendar();
    this.setScale();
    this.title = this.csv.getCommandValue('title');
    this.refresh();
  }

  getDayOfMonth(d: Moment) {
    return d.format('DD');
  }

  getDayOfWeek(d: Moment) {
    return d.format('dd').substr(0, 1);
  }

  buildCalendar(): void {
    const dates = this.csv.data.map((d) => +d.date);
    this.begin = moment('' + Math.min(...dates), FORMAT);
    const end = moment('' + Math.max(...dates), FORMAT);
    const days = Math.ceil(moment.duration(end.diff(this.begin)).asDays());
    this.days = new Array(days)
      .fill(0)
      .map((n, i) => this.begin.clone().add(i, 'days'));

    // months
    this.months = [];
    let iday = this.begin;
    while (iday.isBefore(end)) {
      const dayInMonth =
        iday === this.begin
          ? iday.daysInMonth() - iday.day() - 1
          : iday.daysInMonth();

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

    // week nbr
    this.weeks = [];
    iday = this.begin;
    while (iday.isBefore(end)) {
      const dayInWeek = iday === this.begin ? 7 - iday.weekday() : 7;

      this.weeks.push({
        width: `${dayInWeek * 2}em`,
        label: 'Week ' + iday.format('ww'),
      });
      iday = iday.clone().add(1, 'week');
    }
    this.weeks[this.weeks.length - 1] = {
      width: `${(iday.weekday() + 1) * 2}em`,
      label: 'Week ' + iday.format('ww'),
    };
  }

  isWeekEnd(d: Moment) {
    return [0, 6].includes(d.weekday());
  }

  setScale() {
    const maxHeight = 20;
    ((this.elt.nativeElement as Element).querySelector(
      '.bars'
    ) as HTMLElement).style.height = `${maxHeight + 2}em`;

    const groups = this.csv.data.reduce((acc, r) => {
      const found = acc.find((row) => row.date === r.date);
      if (found) {
        found.value = '' + (+found.value + +r.value);
      } else {
        acc.push({ date: r.date, value: r.value });
      }
      return acc;
    }, []);

    const maxValue = Math.max(...groups.map((d) => +d.value));
    this.scale = maxHeight / maxValue;
  }

  refresh() {
    const bars = d3.select(
      (this.elt.nativeElement as Element).querySelector('.bars')
    );

    const update = () => {
      const data = this.csv.data.reduce((acc, r, i) => {
        const valueSumForGivenDate = acc.filter((row) => row.date === r.date).map(r => +r.value).reduce((acc, r) => acc + r, 0);
        r.__index = valueSumForGivenDate + '';
        acc.push(r);
        return acc;
      }, []);

      const feature = bars.selectAll('div.bar').data(data);

      const transform = (d: any) => {
        const days = Math.round(
          moment.duration(moment(d.date, FORMAT).diff(this.begin)).asDays()
        );
        return `translate(${days * 2}em, -${d.__index * this.scale}em)`;
      };

      feature
        .enter()
        .append('div')
        .classed('bar', true)
        .attr('title', (d) => d.value)
        .style('background-color', (d) => d.color || this.color)
        .style('height', (d) => {
          const value = Math.round(+d.value * this.scale * 1000) / 1000;
          const result = value + 'em';
          console.log('result: ', result);
          return result;
        })
        .on('mouseenter', (d, i, nodes) => {
          this.label = d.value + ' - ' + d.label;
          // d3.select(nodes[i]).classed('hovered', true);
        })
        .on('mouseleave', (d, i, nodes) => {
          this.label = '';
          // d3.select(nodes[i]).classed('hovered', false);
        })
        .on('touchstart', (d, i, array) => {
          this.label = d.value + ' - ' + d.label;
        })
        .style('transform', transform);

      feature.exit().remove();

      feature.style('transform', transform);
    };

    update();
  }
}
