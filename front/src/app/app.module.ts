import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FranceMapComponent } from './dataviz/france-map/france-map.component';

@NgModule({
  declarations: [AppComponent, FranceMapComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [FranceMapComponent],
})
export class AppModule {}
