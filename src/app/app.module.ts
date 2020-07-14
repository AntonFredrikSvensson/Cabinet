import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilesComponent } from './files/files.component';
import { OverviewComponent } from './overview/overview.component';
import { ConnectorsComponent } from './connectors/connectors.component';
import { StartComponent } from './start/start.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DbxAuthComponent } from './dbx-auth/dbx-auth.component';
import { DbxStorageComponent } from './dbx-storage/dbx-storage.component';
import { firebaseConfig } from './environmentalVariables';
import { GdriveStorageComponent } from './gdrive-storage/gdrive-storage.component';
import { GdrAuthComponent } from './gdr-auth/gdr-auth.component';
import { GdrStorageComponent } from './gdr-storage/gdr-storage.component';
import { StorageComponent } from './storage/storage.component';


@NgModule({
  declarations: [
    AppComponent,
    FilesComponent,
    OverviewComponent,
    ConnectorsComponent,
    StartComponent,
    SignUpComponent,
    MainNavComponent,
    DbxAuthComponent,
    DbxStorageComponent,
    GdriveStorageComponent,
    GdrAuthComponent,
    GdrStorageComponent,
    StorageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
