import { Injectable, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { BehaviorSubject } from 'rxjs';

enum state {
  NOT_INITIALIZED,
  INITIALIZED,
  ERROR_DURING_INIT,
}

@Injectable({
  providedIn: 'root',
})
export class DatavizService {
  private isInitialized$ = new BehaviorSubject(state.NOT_INITIALIZED);
  zipcodes: Array<d3.DSVRowString<string>>;

  constructor() {
    this.init();
  }

  async init() {
    try {
      await this.loadZipcodeLatLng();
      this.isInitialized$.next(state.INITIALIZED);
    } catch (error) {}
  }

  waitForInit(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isInitialized$.subscribe((isInitialized) => {
        if (isInitialized === state.INITIALIZED) {
          return resolve();
        }
        if (isInitialized === state.ERROR_DURING_INIT) {
          return reject();
        }
      });
    });
  }

  async loadZipcodeLatLng() {
    this.zipcodes = await d3.csv('./assets/france_zipcode.csv');
    const belgiqueZipcodes = await d3.csv('./assets/belgique_zipcode.csv');
    const suisseZipcodes = await d3.csv('./assets/suisse_zipcode.csv');
    const miscZipcodes = await d3.csv('./assets/misc_zipcode.csv');
    belgiqueZipcodes.forEach((row) => (row.zipcode = 'B-' + row.zipcode));
    suisseZipcodes.forEach((row) => (row.zipcode = 'CH-' + row.zipcode));
    this.zipcodes = this.zipcodes.concat(belgiqueZipcodes);
    this.zipcodes = this.zipcodes.concat(suisseZipcodes);
    this.zipcodes = this.zipcodes.concat(miscZipcodes);
  }
}
