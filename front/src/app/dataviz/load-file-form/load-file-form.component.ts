import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from 'src/app/state.service';

@Component({
  selector: 'app-load-file-form',
  templateUrl: './load-file-form.component.html',
  styleUrls: ['./load-file-form.component.scss'],
})
export class LoadFileFormComponent implements OnInit {
  f = new FormGroup({
    csv: new FormControl(null, [Validators.required]),
  });

  constructor(private router: Router, private state: StateService) {}

  ngOnInit(): void {}

  async submit() {
    this.router.navigateByUrl('/csvp?internal=true');
  }

  async onFileChange(evt: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      await this.state.loadFileFromInternal(file);
    }
  }
}
