import { Component, OnInit } from '@angular/core';
import { DataStore, Predicates, SortDirection } from '@aws-amplify/datastore';
import { Post } from 'src/models';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss']
})
export class BlogPageComponent implements OnInit {
  latestPost: Post | undefined;
  posts: Post[] = [];
  categories: string[] = [];

  chosenCategories: string[] = [];
  categoryChosen: boolean = false;

  subscription: any;
  isLoading: boolean = true;

  constructor() { }

  async ngOnInit() {
    this.posts = await this.getPosts();
    this.latestPost = this.posts[0];
    this.subscription = DataStore.observe(Post).subscribe(async post => {
      this.posts = await this.getPosts();
      this.latestPost = this.posts[0];
    });
    this.categories = this.getCategories();
    this.isLoading = false;
  }

  async getPosts(): Promise<Post[]> {
    try {
      const posts = await DataStore.query(Post, Predicates.ALL, {
        sort: (s) => s.createdAt(SortDirection.DESCENDING),
      });
      return posts;
    } catch (err) {
      console.log('error getting recordings', err);
      return [];
    }
  }

  getCategories() {
    let categories: string[] = [];
    
    for (let post of this.posts) {
      for (let category of post.categories!) {
        if (!categories.includes(category!)) {
          categories.push(category!);
        }
      }
    }
    return categories;
  }

  chooseCategory(category: string) {
    if (this.chosenCategories.includes(category)) {
      this.chosenCategories.splice(this.chosenCategories.indexOf(category), 1);
    } else {
      this.chosenCategories.push(category);
    }

    this.categoryChosen = this.chosenCategories.length != 0;
    console.log(`Chosen categories: ${this.chosenCategories}`);
    console.log(`Categories chosen: ${this.categoryChosen}`);
  }

}
