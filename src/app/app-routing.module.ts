import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AddjobComponent } from './components/addjob/addjob.component';
import { EditjobsComponent } from './components/editjobs/editjobs.component';

const routes: Routes = [
  { path:'',redirectTo:'/home', pathMatch: 'full'},
  { path:'home', component:HomeComponent},
  { path: 'addjob', component: AddjobComponent},
  {path:'editjob/:postId',component: EditjobsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
