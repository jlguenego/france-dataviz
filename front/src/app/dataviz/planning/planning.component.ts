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
  offset = 2;

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
    console.log('dates: ', dates);
    this.begin = moment('' + Math.min(...dates), FORMAT);
    const end = moment('' + Math.max(...dates), FORMAT);
    const days = Math.ceil(moment.duration(end.diff(this.begin)).asDays());
    console.log('days: ', days);
    this.days = new Array(days)
      .fill(0)
      .map((n, i) => this.begin.clone().add(i, 'days'));
    console.log('this.days: ', this.days);

    // months
    this.months = [];
    let iday = this.begin;
    while (iday.isBefore(end)) {
      console.log('iday: ', iday);
      console.log('day in month', iday.daysInMonth());
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
      console.log('iday: ', iday);
      console.log('day in week', iday.weekday());
      const dayInWeek = iday === this.begin ? 7 - iday.weekday() : 7;

      this.weeks.push({
        width: `${dayInWeek * 2}em`,
        label: 'Week ' + iday.format('ww'),
      });
      iday = iday.clone().add(1, 'months');
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
    const maxHeight = 20 + this.offset;
    ((this.elt.nativeElement as Element).querySelector(
      '.bars'
    ) as HTMLElement).style.height = `${maxHeight}em`;

    const maxValue = Math.max(...this.csv.data.map((d) => +d.value));
    this.scale = maxHeight / maxValue;
  }

  refresh() {
    const bars = d3.select(
      (this.elt.nativeElement as Element).querySelector('.bars')
    );

    const update = () => {
      console.log('update', this.csv.data);

      const feature = bars.selectAll('div.bar').data(this.csv.data);

      const transform = (d: any) => {
        const days = Math.round(
          moment.duration(moment(d.date, FORMAT).diff(this.begin)).asDays()
        );
        return `translateX(${days * 2}em)`;
      };

      feature
        .enter()
        .append('div')
        .classed('bar', true)
        .attr('title', (d) => d.value)
        .style('background-color', (d) => d.color || this.color)
        .style(
          'height',
          (d) => this.offset + +d.value * this.scale + 'em' || '1em'
        )
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
