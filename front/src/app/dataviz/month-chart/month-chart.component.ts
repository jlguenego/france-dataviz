import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { Csv } from 'src/app/csv';
import { Moment } from 'moment';
import * as moment from 'moment';
import * as d3 from 'd3';

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
  scale: number;
  color = 'blue';

  constructor(private elt: ElementRef) {}

  getMonthInitial(m: Moment): string {
    return m.format('M');
  }

  ngOnInit(): void {
    this.buildCalendar();
    this.setScale();
    this.refresh();
    this.title = this.csv.getCommandValue('title');
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

  setScale() {
    const maxHeight = 20;
    ((this.elt.nativeElement as Element).querySelector(
      '.bars'
    ) as HTMLElement).style.height = `${maxHeight + 2}em`;

    const maxValue = Math.max(...this.csv.data.map((d) => +d.value));
    this.scale = maxHeight / maxValue;
  }

  refresh() {
    const bars = d3.select(
      (this.elt.nativeElement as Element).querySelector('.bars')
    );

    const update = () => {
      const feature = bars.selectAll('div.bar').data(this.csv.data);

      const transform = (d: d3.DSVRowString<string>) => {
        const months = Math.round(
          moment.duration(moment(d.month, FORMAT).diff(this.begin)).asMonths()
        );
        return `translateX(${months * 2}em)`;
      };

      feature
        .enter()
        .append('div')
        .classed('bar', true)
        .attr('title', (d) => d.value)
        .style('background-color', (d) => d.color || this.color)
        .style('height', (d) => {
          console.log('d: ', d);
          const value = Math.round(+d.value * this.scale * 1000) / 1000;
          const result = value + 'em';
          console.log('result: ', result);
          return result;
        })
        .on('mouseenter', (d, i, nodes) => {
          this.label = d.value;
          // d3.select(nodes[i]).classed('hovered', true);
        })
        .on('mouseleave', (d, i, nodes) => {
          this.label = '';
          // d3.select(nodes[i]).classed('hovered', false);
        })
        .on('touchstart', (d, i, array) => {
          this.label = d.value;
        })
        .style('transform', transform);

      feature.exit().remove();

      feature.style('transform', transform);
    };

    update();
  }
}
