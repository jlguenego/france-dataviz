import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FranceMapComponent } from './dataviz/france-map/france-map.component';
import { HomeComponent } from './routes/home/home.component';
import { DocComponent } from './routes/doc/doc.component';
import { CsvpComponent } from './routes/csvp/csvp.component';
import { FormComponent } from './dataviz/form/form.component';
import { ShareComponent } from './routes/share/share.component';
import { LoadFileFormComponent } from './dataviz/load-file-form/load-file-form.component';
import { ExamplesComponent } from './routes/examples/examples.component';
import { PlanningComponent } from './dataviz/planning/planning.component';
import { MonthChartComponent } from './dataviz/month-chart/month-chart.component';
import { TreeComponent } from './dataviz/tree/tree.component';

@NgModule({
  declarations: [
    AppComponent,
    FranceMapComponent,
    HomeComponent,
    DocComponent,
    CsvpComponent,
    FormComponent,
    ShareComponent,
    LoadFileFormComponent,
    ExamplesComponent,
    PlanningComponent,
    MonthChartComponent,
    TreeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [FranceMapComponent],
})
export class AppModule {}
