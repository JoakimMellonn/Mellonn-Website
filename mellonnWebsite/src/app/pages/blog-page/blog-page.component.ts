import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  currentPage: number = 0;
  pageSize: number = 12;
  categories: string[] = [];

  chosenCategories: string[] = [];

  subscription: any;
  isLoading: boolean = true;
  isReadMoreLoading: boolean = false;

  constructor(
    private router: Router,
  ) { }

  async ngOnInit() {
    this.posts = await this.getPosts(this.currentPage);
    this.latestPost = this.posts[0];
    this.subscription = DataStore.observe(Post).subscribe(async post => {
      this.posts = await this.getPosts(this.currentPage);
      this.categories = this.getCategories();
      this.latestPost = this.posts[0];
    });
    this.categories = this.getCategories();
    this.isLoading = false;
  }

  async getPosts(page: number): Promise<Post[]> {
    try {
      let posts: Post[] = [];
      for (let i = 0; i <= page; i++) {
        const query = await DataStore.query(Post, Predicates.ALL, {
          sort: (s) => s.createdAt(SortDirection.DESCENDING),
          limit: this.pageSize,
          page: i,
        });
        for (let post of query) {
          posts.push(post);
        }
      }
      return posts;
    } catch (err) {
      console.log('error getting posts', err);
      return [];
    }
  }

  async readMore() {
    this.isReadMoreLoading = true;
    this.currentPage++;
    this.posts = await this.getPosts(this.currentPage);
    this.isReadMoreLoading = false;
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
    this.chosenCategories.sort();
  }

}
