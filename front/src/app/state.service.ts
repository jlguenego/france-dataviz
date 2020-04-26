import { Injectable } from '@angular/core';
import { csvp } from 'src/app/csvp';



@Injectable({
  providedIn: 'root',
})
export class StateService {
  csvpFilename: string;

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
