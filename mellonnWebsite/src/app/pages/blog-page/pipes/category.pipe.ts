import { Pipe, PipeTransform } from '@angular/core';
import { Post } from 'src/models';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  transform(posts: Post[], categories: string[]): Post[] {
    if(categories.length == 0) return posts;
    
    let result: Post[] = [];

    for (let post of posts) {
      for (let category of categories) {
        if (post.categories!.includes(category)) result.push(post);
      }
    }

    return result;
  }

}
