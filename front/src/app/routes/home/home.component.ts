import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(public state: StateService) {}

  ngOnInit(): void {}
}
