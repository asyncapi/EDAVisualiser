import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ApplicationViewComponent } from './applicationview.component';

@NgModule({
  declarations: [
    AppComponent,
    ApplicationViewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [ApplicationViewComponent]
})
export class AppModule { }
