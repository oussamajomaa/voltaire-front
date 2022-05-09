import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// import { HashLocationStrategy, LocationStrategy } from '@angular/common';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AddItemComponent } from './add-item/add-item.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { ShowItemComponent } from './show-item/show-item.component';
import { AboutComponent } from './about/about.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { ContributorComponent } from './contributor/contributor.component';
import { BookComponent } from './book/book.component';

import { MaterialModule } from './material.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgSelect2Module } from 'ng-select2';
import { ChartsComponent } from './charts/charts.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxEchartsModule } from 'ngx-echarts';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SideNavComponent,
    AddItemComponent,
    ShowItemComponent,
    AboutComponent,
    EditItemComponent,
    ContributorComponent,
    BookComponent,
    NotFoundComponent,
    ChartsComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 1500,
      easing:'ease-in',
      positionClass:"toast-top-center"
    }),
    MaterialModule,
    NgSelect2Module,
    NgxSliderModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
