import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FolderComponent } from './components/folder/folder.component';
import { LoginComponent } from './components/login/login.component';
import { MasterComponent } from './components/master/master.component';
import { LoginGuard } from './guard/login.guard';

const routes: Routes = [
  
  { path:'login',component: LoginComponent,pathMatch: 'full'},
  { path:'home',component: MasterComponent,canActivate:[LoginGuard], pathMatch: 'full'},
  {path :'folder/:folder_name/:id_folder',canActivate:[LoginGuard],component :FolderComponent,pathMatch:'full'},
  { path:'**',component: LoginComponent, pathMatch: 'full'}

  



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

  
}
