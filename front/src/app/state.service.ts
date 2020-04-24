import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  csvFilename = './assets/xxx_clients.csv';

  constructor() { }
}
