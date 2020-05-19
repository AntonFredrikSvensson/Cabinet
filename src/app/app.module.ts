import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

//temporary in-memory api to lear how to retrieve data from HTTPClients
import { InMemoryDataService }  from './in-memory-data.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import {GoogleApis} from 'googleapis'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilesComponent } from './files/files.component';
import { OverviewComponent } from './overview/overview.component';
import { ConnectorsComponent } from './connectors/connectors.component';
import { MessagesComponent } from './messages/messages.component';
import { GdriveComponent } from './gdrive/gdrive.component'; 

@NgModule({
  declarations: [
    AppComponent,
    FilesComponent,
    OverviewComponent,
    ConnectorsComponent,
    MessagesComponent,
    GdriveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    GoogleApis,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
