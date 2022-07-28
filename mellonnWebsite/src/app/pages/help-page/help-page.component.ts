import { Component, OnInit } from '@angular/core';
import { Article, Articles } from './articles';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss']
})
export class HelpPageComponent implements OnInit {
  articles: Article[];
  data: string = '';

  standardURL: string = 'https://mellonn-website.s3.eu-central-1.amazonaws.com/markdown/help/';
  articlesURL: string = `${this.standardURL}articles.json`;
  welcomeFile: string = 'welcome.md';

  constructor() { }

  async ngOnInit() {
    window.location.href = 'https://docs.mellonn.com';
    //await this.getArticlesFromURL(this.articlesURL);
    //await this.getData(this.welcomeFile, '');
  }

  async getArticlesFromURL(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw 'notOkay';

      const returnArticles: Articles = await response.json();
      this.articles = returnArticles.articles;
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }

  async getData(fileName: string, prefix: string) {
    const url = `${this.standardURL}${prefix}${fileName}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw 'notOkay';

      this.data = await response.text();
      console.log(this.data);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }
}
