import { Injectable } from '@angular/core';

const DEFAULT_URL = './assets/jlg_consulting_france_clients.csv';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  csvFilename = DEFAULT_URL;

  constructor() {
    this.loadFileFromURL();
  }

  async loadFileFromURL() {
    try {
      const response = await fetch(this.csvFilename, {
        mode: 'no-cors',
      });
      const content = await response.text();
      console.log('content: ', content);
      if (content === '') {
        throw new Error('CORS problem');
      }

      localStorage.setItem('current-csv-content', content);
    } catch (error) {
      localStorage.removeItem('current-csv-content');
      alert('Ton fichier peut pas ̂être chargé à cause du CORS');
      throw error;
    }
  }
}
