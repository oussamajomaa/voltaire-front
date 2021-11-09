import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ContributorComponent } from './contributor/contributor.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';
import { ShowItemComponent } from './show-item/show-item.component';

const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'home', component:HomeComponent},
  {path:'add-item', component:AddItemComponent},
  {path:'edit-item', component:EditItemComponent},
  {path:'show-item', component:ShowItemComponent},
  {path:'contributor', component:ContributorComponent},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent, canActivate:[AuthGuard]},
  {path:'about', component:AboutComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
