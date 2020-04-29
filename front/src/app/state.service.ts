import { Injectable } from '@angular/core';
import { csvp } from 'src/app/csvp';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  csvpFilename = localStorage.getItem('csvpFilename');
  iframeCode = localStorage.getItem('iframeCode');

  constructor() {}

  setCsvpFilename(str: string) {
    this.csvpFilename = str;
    localStorage.setItem('csvpFilename', str);
  }

  setIframeCode(str: string) {
    this.iframeCode = str;
    localStorage.setItem('iframeCode', str);
  }

  async loadFileFromURL() {
    try {
      const content = await csvp(this.csvpFilename);

      localStorage.setItem('current-csv-content', content);
    } catch (error) {
      localStorage.removeItem('current-csv-content');
      throw error;
    }
  }

  async loadFileFromInternal(file: Blob) {
    try {
      if (file) {
        const fileReader = new FileReader();
        fileReader.readAsText(file, 'UTF-8');
        fileReader.onload = (evt) => {
          const str = (evt.target.result as string)
            .split('\n')
            .filter(
              (row) => !row.startsWith('csvp(`') && !row.startsWith('`);')
            )
            .join('\n');

          localStorage.setItem('current-csv-content', str);
          this.setCsvpFilename(undefined);
        };
        fileReader.onerror = function (evt) {
          console.error('evt: ', evt);
        };
      }
    } catch (error) {
      localStorage.removeItem('current-csv-content');
      throw error;
    }
  }
}
