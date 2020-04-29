import { Component, OnInit, ElementRef } from '@angular/core';
import { StateService } from './state.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isFullScreen = false;

  constructor(
    private elt: ElementRef,
    private state: StateService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((qp) => {
      this.isFullScreen = qp.isFullScreen === 'true';
    });
  }

  ngOnInit(): void {}
}
