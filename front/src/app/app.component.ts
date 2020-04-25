import { Component, OnInit, ElementRef } from '@angular/core';
import { StateService } from './state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private elt: ElementRef, private state: StateService) {}

  ngOnInit(): void {
  }

}
