import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'instituteRename'
})
export class InstituteRenamePipe implements PipeTransform {
  transform(value: string): string {
    const words: string[] = value.trim().split(/\s+/);
    let output: string = words[words.length - 1].charAt(0).toUpperCase() + words[words.length - 1].slice(1) + " ";
    for(let i = 0; i < words.length - 1; i++){
      output += words[i].toLocaleLowerCase() + " ";
    }
    return output;
  }
}
