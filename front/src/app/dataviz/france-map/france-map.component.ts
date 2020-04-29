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
import { StateService } from 'src/app/state.service';
import { ActivatedRoute } from '@angular/router';
import { validURL } from 'src/app/misc';
import { DatavizService } from 'src/app/dataviz.service';

const DEFAULT_URL =
  'https://jlg-consulting.com/dataviz/jlg_consulting_france_clients.csvp';

@Component({
  selector: 'app-france-map',
  templateUrl: './france-map.component.html',
  styleUrls: ['./france-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FranceMapComponent implements OnInit {
  csvContent: string;
  map: L.Map;
  svg: any;
  data: any[];
  label = '';

  title = '';
  color = 'red';

  constructor(
    private elt: ElementRef,
    private state: StateService,
    private dataviz: DatavizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (qp) => {
      if (!qp.internal) {
        this.state.setCsvpFilename(validURL(qp.url) ? qp.url : DEFAULT_URL);
        await this.state.loadFileFromURL();
      }
      this.refresh();
    });
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

  parseOptions() {
    const commentArray = this.csvContent.split(/[\r\n]+/).filter((row) => {
      return row.startsWith('# ');
    });

    const getValue = (key: string) => commentArray.filter(r => r.startsWith('# ' + key + '='))[0]?.substr(('# ' + key + '=').length);

    this.title = getValue('title');
    this.color = getValue('color') || this.color;
  }

  async refresh() {
    try {
      await this.init();
      this.csvContent = localStorage.getItem('current-csv-content');
      if (!this.csvContent) {
        return;
      }

      this.parseOptions();

      // filter comment.
      const filteredContent = this.csvContent.replace(
        /^[#@][^\r\n]+[\r\n]+/gm,
        ''
      );
      // remove all empty lines.
      const filterEmptyLines = filteredContent
        .replace(/^[\r\n]+/gm, '\n')
        // remove the first empty line.
        .replace(/^[\r\n]/, '');

      const csvData = d3.csvParse(filterEmptyLines);
      this.data = csvData;

      const g = d3.select(this.svg._rootGroup).classed('d3-overlay', true);

      this.data.forEach((d: any) => {
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
      console.log('error: ', error);
    }
  }
}
