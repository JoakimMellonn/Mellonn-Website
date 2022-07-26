import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SpeakShowcaseComponent } from './pages/speak-showcase/speak-showcase.component';
import { BlogPageComponent } from './pages/blog-page/blog-page.component';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu/menu.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { BlogViewerComponent } from './pages/blog-page/blog-viewer/blog-viewer.component';
import { CategoryPipe } from './pages/blog-page/pipes/category.pipe';
import { CategoryStringPipe } from './pages/blog-page/pipes/category-string.pipe';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SpeakShowcaseComponent,
    BlogPageComponent,
    MenuComponent,
    HelpPageComponent,
    BlogViewerComponent,
    CategoryPipe,
    CategoryStringPipe,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
