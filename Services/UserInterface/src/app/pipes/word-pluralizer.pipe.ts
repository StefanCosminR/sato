import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'wordPluralizer'})
export class WordPluralizerPipe implements PipeTransform {
    transform(word: string): string {
        switch (word) {
            case 'Article':
                return 'Articles';
            case 'Tutorial':
                return 'Tutorials';
            case 'Repository':
                return 'Repositories';
            case 'News':
                return 'News';
            default:
                return '';
        }
    }
}
