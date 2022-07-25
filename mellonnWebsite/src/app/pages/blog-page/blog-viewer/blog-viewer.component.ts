import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStore } from '@aws-amplify/datastore';
import { Post } from 'src/models';

@Component({
  selector: 'app-blog-viewer',
  templateUrl: './blog-viewer.component.html',
  styleUrls: ['./blog-viewer.component.scss']
})
export class BlogViewerComponent implements OnInit {
  id: string = '';
  post: Post | undefined;
  markdown: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meta: Meta,
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.markdown = await this.getPost();

    
  }

  async getPost(): Promise<string> {
    try {
      this.post = await DataStore.query(Post, this.id)!;

      const response = await fetch(this.post?.markdownKey!);
      return await response.text();
    } catch (err) {
      console.log('error getting recordings', err);
      return 'error';
    }
  }

  setTags(post: Post) {
    this.meta.updateTag({ property: "og:title", content: post.title});
    this.meta.updateTag({ property: "og:description", content: post.description ?? ''});
    this.meta.updateTag({ property: "og:url", content: this.router.url});
    this.meta.updateTag({ property: "og:image", content: post.pictureKey ?? 'https://mellonn-website.s3.eu-central-1.amazonaws.com/logos/Design_1whiteGrey.png'});
  }

}
