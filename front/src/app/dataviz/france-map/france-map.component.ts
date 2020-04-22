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

  @Input() csvFilename: string;

  constructor(private elt: ElementRef) {}

  ngOnInit(): void {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges this.csvFilename: ', this.csvFilename);
    this.refresh();
  }

  async init() {
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
  }

  async refresh() {
    try {
      if (!this.isInitialized) {
        this.init();
        this.isInitialized = true;
      }

      console.log('this.csvFilename: ', this.csvFilename);
      const csvData = await d3.csv(this.csvFilename);
      this.data = csvData;

      const g = d3.select(this.svg._rootGroup).classed('d3-overlay', true);

      this.data.forEach(
        (d: any) =>
          (d.LatLng = new L.LatLng(
            (+d.latitude) + 0.01 * (Math.floor(Math.random() * 1000000) / 1000000),
            (+d.longitude) + 0.01 * (Math.floor(Math.random() * 1000000) / 1000000)
          ))
      );

      console.log('this.data', this.data);

      const update = () => {
        console.log('update');

        const feature = g.selectAll('circle').data(this.data);

        feature
          .enter()
          .append('circle')
          .style('stroke', 'black')
          .style('opacity', 0.6)
          .style('fill', 'red')
          .attr('r', 15)
          .attr('pointer-events', 'visible')
          .on('mouseover', (d, i, array) => {
            this.label = d.label;
          })
          .on('touchstart', (d, i, array) => {
            this.label = d.label;
          });

        feature.exit().remove();

        feature.attr('transform', (d: any) => {
          return (
            'translate(' +
            this.map.latLngToLayerPoint(d.LatLng).x +
            ',' +
            this.map.latLngToLayerPoint(d.LatLng).y +
            ')'
          );
        });
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
}
