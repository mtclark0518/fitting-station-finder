import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CardComponent, CardListComponent, DetailedComponent, IconButtonComponent, LayoutComponent,MapComponent,MapControlsComponent, EsriSearchComponent, NavigationComponent, GetDirectionsLinkComponent, AboutUsModal } from './components';
import { AwaitsClickOutsideDirective, OnHoverDirective } from './directives';



@NgModule({
  declarations: [
    AppComponent,
    AboutUsModal,
    CardComponent,
    CardListComponent,
    DetailedComponent,
    EsriSearchComponent,
    GetDirectionsLinkComponent,
    IconButtonComponent,
    LayoutComponent,
    MapComponent,
    MapControlsComponent,
    NavigationComponent,
    OnHoverDirective,
    AwaitsClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
