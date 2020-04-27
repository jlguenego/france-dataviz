import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validURL } from 'src/app/misc';
import { StateService } from 'src/app/state.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  f = new FormGroup({
    url: new FormControl('https://jlg-consulting.com/dataviz/clients.csvp', [
      Validators.required,
    ]),
  });

  constructor(private router: Router, private state: StateService) {}

  ngOnInit(): void {}

  submit() {
    if (!validURL(this.f.value.url)) {
      alert('please enter a valid url');
      return;
    }
    this.router.navigateByUrl('/csvp?url=' + this.f.value.url);
  }

  async generateIframe() {
    if (!validURL(this.f.value.url)) {
      alert('please enter a valid url');
      return;
    }
    this.state.setCsvpFilename(this.f.value.url);
    this.state.setIframeCode(`<iframe src="https://france-dataviz.web.app/csvp?isFullScreen=true&url=${encodeURIComponent(
      this.f.value.url
    )}" width="100%" height="450" frameborder="0" style="border: 0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`);
    await this.router.navigateByUrl('/share');
  }
}
