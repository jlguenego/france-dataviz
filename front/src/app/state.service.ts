import { Injectable } from '@angular/core';
import { csvp } from 'src/app/csvp';



@Injectable({
  providedIn: 'root',
})
export class StateService {
  csvpFilename: string;
  iframeCode: string;

  constructor() {}

  async loadFileFromURL() {
    try {
      const content = await csvp(this.csvpFilename);

      localStorage.setItem('current-csv-content', content);
    } catch (error) {
      localStorage.removeItem('current-csv-content');
      throw error;
    }
  }
}
