import { NgModule } from '@angular/core';
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


import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import {MatPaginatorModule} from '@angular/material/paginator';

import { FlexLayoutModule } from '@angular/flex-layout';
import { SideNavComponent } from './side-nav/side-nav.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AddItemComponent } from './add-item/add-item.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { MatTableModule } from '@angular/material/table'  
import { ToastrModule } from 'ngx-toastr';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ShowItemComponent } from './show-item/show-item.component';
import { AboutComponent } from './about/about.component';
import {MatRadioModule} from '@angular/material/radio';
import { EditItemComponent } from './edit-item/edit-item.component';
import { ContributorComponent } from './contributor/contributor.component';



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
    ContributorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatTooltipModule,
    MatRadioModule,
    ToastrModule.forRoot({
      timeOut: 1500,
      easing:'ease-in',
      positionClass:"toast-top-center"
    })
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
