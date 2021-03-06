import {
  Component,
  OnInit,
  ElementRef,
  ViewEncapsulation,
  Input,
} from '@angular/core';

import * as L from 'leaflet';
import * as d3 from 'd3';
import { DatavizService } from 'src/app/dataviz.service';
import { Csv } from 'src/app/csv';

interface CsvRow {
  latitude?: string;
  longitude?: string;
  LatLng?: L.LatLng;
  zipcode: string;
  label: string;
  color?: string;
  value?: string;
}

@Component({
  selector: 'app-france-map',
  templateUrl: './france-map.component.html',
  styleUrls: ['./france-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FranceMapComponent implements OnInit {
  @Input() csv: Csv;
  csvContent: string;
  map: L.Map;
  svg: any;
  data: CsvRow[];
  label = '';

  title = '';
  color = 'red';

  constructor(
    private elt: ElementRef,
    private dataviz: DatavizService,
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  async init() {
    const zoom = window.innerWidth < 500 ? 5 : 6;
    const center: L.LatLngExpression =
      window.innerWidth < 500 ? [45.5, 1.8] : [46.9, 1];

    this.map = L.map(
      (this.elt.nativeElement as HTMLElement).querySelector(
        '.leaflet-map'
      ) as HTMLElement
    ).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.svg = L.svg();
    this.map.addLayer(this.svg);

    await this.dataviz.waitForInit();
  }

  async refresh() {
    try {
      await this.init();

      this.title = this.csv.getCommandValue('title') || this.title;
      this.color = this.csv.getCommandValue('color') || this.color;
      this.data = this.csv.data as unknown as CsvRow[];
      this.data.forEach(d => {
        if (!('latitude' in d)) {
          let place = this.dataviz.zipcodes.find(
            (place) => place.zipcode === d.zipcode
          );
          if (!place) {
            place = this.dataviz.zipcodes.find(
              (place) => place.zipcode === '75001'
            );
          }
          d.latitude = place.latitude;
          d.longitude = place.longitude;
        }
        d.LatLng = new L.LatLng(
          +d.latitude + 0.01 * (Math.floor(Math.random() * 1000000) / 1000000),
          +d.longitude + 0.01 * (Math.floor(Math.random() * 1000000) / 1000000)
        );
      });

      const g = d3.select(this.svg._rootGroup).classed('d3-overlay', true);

      const update = () => {

        const feature = g.selectAll('circle').data(this.data);

        const transform = (d: any) => {
          return (
            'translate(' +
            this.map.latLngToLayerPoint(d.LatLng).x +
            ',' +
            this.map.latLngToLayerPoint(d.LatLng).y +
            ')'
          );
        };

        feature
          .enter()
          .append('circle')
          .classed('d3-circle', true)
          .style('fill', (d) => d.color || this.color)
          .attr('r', (d) => d.value || 15)
          .attr('pointer-events', 'visible')
          .on('mouseenter', (d, i, nodes) => {
            this.label = d.label;
            // d3.select(nodes[i]).classed('hovered', true);
          })
          .on('mouseleave', (d, i, nodes) => {
            this.label = '';
            // d3.select(nodes[i]).classed('hovered', false);
          })
          .on('touchstart', (d, i, array) => {
            this.label = d.label;
          })
          .attr('transform', transform);

        feature.exit().remove();

        feature.attr('transform', transform);
      };

      this.map.on('zoomend', () => {
        update();
      });

      update();
    } catch (error) {
      if (error instanceof TypeError && error.message.match(/fetch/)) {
        alert(
          'url not reachable. Check the url is ok and the server allows CORS.'
        );
        return;
      }
      console.error('error: ', error);
    }
  }
}
