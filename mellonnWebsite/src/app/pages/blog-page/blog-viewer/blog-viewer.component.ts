import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.markdown = await this.getPost();
  }

  async getPost(): Promise<string> {
    try {
      this.post = await DataStore.query(Post, this.id)!;

      console.log('Key: ' + this.post?.markdownKey);

      const response = await fetch(this.post?.markdownKey!);

      console.log(response);
      return await response.text();

    } catch (err) {
      console.log('error getting recordings', err);
      return 'error';
    }
  }

}
