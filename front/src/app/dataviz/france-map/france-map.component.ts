import {
  Component,
  OnInit,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';

import L from 'leaflet';
import * as d3 from 'd3';

@Component({
  selector: 'app-france-map',
  templateUrl: './france-map.component.html',
  styleUrls: ['./france-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FranceMapComponent implements OnInit {
  constructor(private elt: ElementRef) {}

  ngOnInit(): void {
    (async () => {
      try {
        const map = L.map(this.elt.nativeElement).setView([46.9, 1], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const csvData = await d3.csv('./assets/caracteristiques-2017.csv');
        // const data = csvData.filter(d => d.mois === '1' && d.jour === '5');
        const data = csvData.filter((d) => d.mois === '1');
        // const data = csvData;

        const svg: any = L.svg();
        map.addLayer(svg);
        const g = d3.select(svg._rootGroup).classed('d3-overlay', true);

        data.forEach(
          (d: any) => (d.LatLng = new L.LatLng(+d.lat / 100000, +d.long / 100000))
        );
        console.log('data', data);
        const feature = g
          .selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
          .style('stroke', 'black')
          .style('opacity', 0.6)
          .style('fill', 'red')
          .attr('r', 5);

        map.on('zoomend', function () {
          update();
        });
        update();

        function update() {
          console.log('update');
          feature.attr('transform', function (d: any) {
            return (
              'translate(' +
              map.latLngToLayerPoint(d.LatLng).x +
              ',' +
              map.latLngToLayerPoint(d.LatLng).y +
              ')'
            );
          });
        }
      } catch (error) {
        console.log('error: ', error);
      }
    })();
  }
}
