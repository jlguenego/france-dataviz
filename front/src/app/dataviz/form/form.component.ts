import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validURL } from 'src/app/misc';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  f = new FormGroup({
    url: new FormControl('https://jlg-consulting.com/dataviz/clients.csvp', [Validators.required]),
  });

  constructor(private router: Router) {}

  ngOnInit(): void {}

  submit() {
    if (!validURL(this.f.value.url)) {
      alert('please enter a valid url');
      return;
    }
    this.router.navigateByUrl('/csvp?url=' + this.f.value.url);
  }
}
