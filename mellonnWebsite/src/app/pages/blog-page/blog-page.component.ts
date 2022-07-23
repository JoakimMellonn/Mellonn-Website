import { Component, OnInit } from '@angular/core';
import { DataStore, Predicates, SortDirection } from '@aws-amplify/datastore';
import { Post } from 'src/models';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss']
})
export class BlogPageComponent implements OnInit {
  posts: Post[] = [];
  subscription: any;

  constructor() { }

  async ngOnInit() {
    await this.getPosts();
    this.subscription = DataStore.observe(Post).subscribe(post => {
      this.getPosts();
    });
  }

  async getPosts() {
    try {
      const posts = await DataStore.query(Post, Predicates.ALL, {
        sort: (s) => s.createdAt(SortDirection.ASCENDING),
      });
      this.posts = posts;
      console.log(`Posts length: ${posts.length}`);
    } catch (err) {
      console.log('error getting recordings', err);
    }
  }

}
