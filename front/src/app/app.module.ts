import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FranceMapComponent } from './dataviz/france-map/france-map.component';
import { HomeComponent } from './routes/home/home.component';
import { DocComponent } from './routes/doc/doc.component';
import { MenuComponent } from './routes/menu/menu.component';
import { CsvpComponent } from './routes/csvp/csvp.component';
import { FormComponent } from './dataviz/form/form.component';

@NgModule({
  declarations: [AppComponent, FranceMapComponent, HomeComponent, DocComponent, MenuComponent, CsvpComponent, FormComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [FranceMapComponent],
})
export class AppModule {}
