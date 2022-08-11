import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStore } from '@aws-amplify/datastore';
import { delay } from 'rxjs';
import { Post } from 'src/models';

@Component({
  selector: 'app-blog-viewer',
  templateUrl: './blog-viewer.component.html',
  styleUrls: ['./blog-viewer.component.scss']
})
export class BlogViewerComponent implements OnInit, AfterViewInit {
  id: string = '';
  post: Post | undefined;
  markdown: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meta: Meta,
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    //console.log(`ID: ${this.id}`);
    this.markdown = await this.getPost(this.id);
    this.isLoading = false;
  }

  async ngAfterViewInit() {
    while (!this.isLoading) {
      if (this.markdown == 'error') {
        console.log('trying again');
        this.markdown = await this.getPost(this.id);
        break;
      }
      console.log('no error');
      break;
    }
  }

  async getPost(id: string): Promise<string> {
    let isTrying = true;
    let tries = 0;

    while (isTrying) {
      try {
        console.log('Getting post');
        this.post = await DataStore.query(Post, id)!;
        console.log(this.post?.markdownKey);
        if (this.post?.markdownKey == 'https://www.mellonn.com/undefined') throw 'notOkay';
  
        const response = await fetch(this.post?.markdownKey!);
        console.log(response);
        if (!response.ok) throw 'notOkay';
  
        return await response.text();
      } catch (err) {
        if (err == 'notOkay') {
          isTrying = true;
          tries++;
          if (tries == 50) return 'error';
        } else {
          console.log('error getting post', err);
          return 'error';
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('Trying again...');
    }
    return 'error';
  }

  setTags(post: Post) {
    this.meta.updateTag({ property: "og:title", content: post.title});
    this.meta.updateTag({ property: "og:description", content: post.description ?? ''});
    this.meta.updateTag({ property: "og:url", content: this.router.url});
    this.meta.updateTag({ property: "og:image", content: post.pictureKey ?? 'https://mellonn-website.s3.eu-central-1.amazonaws.com/logos/Design_1whiteGrey.png'});
  }

}
