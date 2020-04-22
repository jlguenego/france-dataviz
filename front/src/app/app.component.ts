import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  f = new FormGroup({
    csvFilename: new FormControl(
      '',
      [Validators.required]
    ),
  });
  csvFilename = './assets/xxx_clients.csv';

  submit() {
    console.log('this.f.value.csvFilename: ', this.f.value.csvFilename);
    this.csvFilename = this.f.value.csvFilename;
  }
}
