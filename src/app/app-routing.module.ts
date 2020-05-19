import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilesComponent } from './files/files.component';
import { OverviewComponent } from './overview/overview.component';
import { ConnectorsComponent } from './connectors/connectors.component';


const routes: Routes = [
  {path: 'files', component: FilesComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'connectors', component: ConnectorsComponent},
  {path: 'gdrive', component: ConnectorsComponent},
  { path: '', redirectTo: '/gdrive', pathMatch: 'full'},
  { path: '**', redirectTo: '/gdrive', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
