import { Pipe, PipeTransform } from '@angular/core';
import { Post } from 'src/models';

@Pipe({
  name: 'category',
  pure: false
})
export class CategoryPipe implements PipeTransform {

  transform(posts: Post[], categories: string[]): Post[] {
    if(categories.length == 0) return posts;
    
    let result: Post[] = [];

    for (let post of posts) {
      let isMatching: boolean = false;
      for (let category of categories) {
        if (post.categories!.includes(category)) {
          isMatching = true;
        } else {
          isMatching = false;
          break;
        }
      }

      if (isMatching) result.push(post);
    }

    return result;
  }

}
