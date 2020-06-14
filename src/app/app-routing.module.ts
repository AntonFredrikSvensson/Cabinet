import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilesComponent } from './files/files.component';
import { OverviewComponent } from './overview/overview.component';
import { ConnectorsComponent } from './connectors/connectors.component';
import { StartComponent } from './start/start.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DbxAuthComponent } from './dbx-auth/dbx-auth.component';


const routes: Routes = [
  {path: 'files', component: FilesComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'connectors', component: ConnectorsComponent},
  {path: 'start', component: StartComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'dbxauth', component: DbxAuthComponent},
  { path: '**', redirectTo: '/files', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
