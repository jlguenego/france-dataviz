import { Component, OnInit, ElementRef } from '@angular/core';
import { StateService } from 'src/app/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(
    private elt: ElementRef,
    private state: StateService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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
      };
      fileReader.onerror = function (evt) {
        console.log('evt: ', evt);
      };
    }
  }

  async onClick() {
    try {
      console.log('onClick');
      const value = (this.elt.nativeElement.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement).value;
      console.log('value: ', value);
      this.state.csvFilename = value;
      await this.state.loadFileFromURL();
      await this.router.navigateByUrl('/');
    } catch (error) {
      console.error('error: ', error);
    }
  }
}
