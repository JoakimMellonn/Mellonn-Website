import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { BlogPageComponent } from './pages/blog-page/blog-page.component';
import { BlogViewerComponent } from './pages/blog-page/blog-viewer/blog-viewer.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { SpeakPageComponent } from './pages/speak-page/speak-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'speak', component: SpeakPageComponent },
  { path: 'blog', component: BlogPageComponent },
  { path: 'blog/:id', component: BlogViewerComponent },
  { path: 'help', component: HelpPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
