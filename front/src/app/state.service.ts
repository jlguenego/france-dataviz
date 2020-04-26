import { Injectable } from '@angular/core';
import { csvp } from 'src/app/csvp';

const DEFAULT_URL =
  'http://jlg-consulting.com/dataviz/jlg_consulting_france_clients.csvp';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  csvpFilename = DEFAULT_URL;

  constructor() {}

  async loadFileFromURL() {
    try {
      console.log('about to load csvp', this.csvpFilename);
      const content = await csvp(this.csvpFilename);
      console.log('content: ', content);

      localStorage.setItem('current-csv-content', content);
    } catch (error) {
      localStorage.removeItem('current-csv-content');
      throw error;
    }
  }
}
