import {
  Component,
  OnInit,
  ElementRef,
  ViewEncapsulation,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import * as L from 'leaflet';
import * as d3 from 'd3';

@Component({
  selector: 'app-france-map',
  templateUrl: './france-map.component.html',
  styleUrls: ['./france-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FranceMapComponent implements OnChanges, OnInit {
  map: L.Map;
  svg: any;
  data: any[];
  isInitialized = false;
  label = '';
  zipcodes: d3.DSVRowArray<string>;

  @Input() csvFilename: string;

  constructor(private elt: ElementRef) {}

  async loadZipcodeLatLng() {
    this.zipcodes = await d3.csv('./assets/zipcode.csv');
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges this.csvFilename: ', this.csvFilename);
    this.refresh();
  }

  async init() {
    console.log('init');
    this.map = L.map(
      (this.elt.nativeElement as HTMLElement).querySelector(
        '.leaflet-map'
      ) as HTMLElement
    ).setView([46.9, 1], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.svg = L.svg();
    this.map.addLayer(this.svg);

    await this.loadZipcodeLatLng();
    await this.loadDefaultFile();
  }

  async refresh() {
    console.log('refresh');
    try {
      if (!this.isInitialized) {
        await this.init();
        this.isInitialized = true;
      }

      console.log('this.csvFilename: ', this.csvFilename);
      const csvContent = localStorage.getItem('current-csv-content');
      if (!csvContent) {
        return;
      }
      // filter comment.
      const filteredContent = csvContent.replace(/^[#@][^\r\n]+[\r\n]+/gm, '');
      const filterEmptyLines = filteredContent.replace(/^[\r\n]+/gm, '\n');
      const csvData = d3.csvParse(filterEmptyLines);
      this.data = csvData;

      const g = d3.select(this.svg._rootGroup).classed('d3-overlay', true);

      this.data.forEach((d: any) => {
        if (!('latitude' in d)) {
          console.log('latitude not found in d', d);
          const place = this.zipcodes.find(
            (place) => place.zipcode === d.zipcode
          );
          console.log('place: ', place);
          d.latitude = place.latitude;
          d.longitude = place.longitude;
        }
        d.LatLng = new L.LatLng(
          +d.latitude + 0.01 * (Math.floor(Math.random() * 1000000) / 1000000),
          +d.longitude + 0.01 * (Math.floor(Math.random() * 1000000) / 1000000)
        );
      });

      const update = () => {
        console.log('update');

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
          .style('stroke', 'black')
          .style('opacity', 0.6)
          .style('fill', 'red')
          .attr('r', 15)
          .attr('pointer-events', 'visible')
          .on('mouseenter', (d, i, array) => {
            this.label = d.label;
          })
          .on('mouseleave', (d, i, array) => {
            this.label = '';
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
      console.log('error: ', error);
    }
  }

  async loadDefaultFile() {
    const response = await fetch('./assets/jlg_consulting_france_clients.csv');
    const content = await response.text();
    console.log('content: ', content);

    localStorage.setItem('current-csv-content', content);
  }
}
