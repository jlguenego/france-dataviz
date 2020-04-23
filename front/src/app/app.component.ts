import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  csvFilename = './assets/xxx_clients.csv';
  constructor(private elt: ElementRef) {}

  ngOnInit(): void {
  }

  onChange() {
    console.log('onChange');
    const file = (this.elt.nativeElement.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement).files[0];
    if (file) {
      console.log('file found', file);
      const fileReader = new FileReader();
      fileReader.readAsText(file, 'UTF-8');
      fileReader.onload = (evt) => {
        // console.log('evt.target.result', evt.target.result);
        localStorage.setItem(
          'current-csv-content',
          evt.target.result as string
        );
        this.csvFilename = file.name;
      };
      fileReader.onerror = function (evt) {
        console.log('evt: ', evt);
      };
    }
  }
}
