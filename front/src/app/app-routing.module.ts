import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { DocComponent } from './routes/doc/doc.component';
import { CsvpComponent } from './routes/csvp/csvp.component';
import { ShareComponent } from './routes/share/share.component';
import { ExamplesComponent } from './routes/examples/examples.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'csvp', component: CsvpComponent },
  { path: 'doc', component: DocComponent },
  { path: 'share', component: ShareComponent },
  { path: 'examples', component: ExamplesComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
