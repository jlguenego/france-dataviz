import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { DocComponent } from './routes/doc/doc.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'doc', component: DocComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
