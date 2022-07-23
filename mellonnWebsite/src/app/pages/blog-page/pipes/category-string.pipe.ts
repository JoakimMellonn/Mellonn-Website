import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryString'
})
export class CategoryStringPipe implements PipeTransform {

  transform(categories: string[], chosen: string[]): string[] {
    let result: string[] = [];

    for (let category of categories) {
      if (!chosen.includes(category)) result.push(category);
    }

    return result;
  }

}
