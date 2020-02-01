import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'resourceNameExtractorPipe'})
export class ResourceNameExtractorPipe implements PipeTransform {
    readonly MAX_NAME_LENGTH = 13;

    transform(url: string): string {
        const name = url.substr(url.lastIndexOf('/') + 1);
        if (name.length > this.MAX_NAME_LENGTH) {
            return `${name.substr(0, this.MAX_NAME_LENGTH)}...`;
        }
        return name;
    }
}
