import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/state.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {
  constructor(public state: StateService, private location: Location) {}

  ngOnInit(): void {}

  back() {
    this.location.back();
  }

  copy() {
    console.log('this.state.iframeCode', this.state.iframeCode);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.state.iframeCode;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
