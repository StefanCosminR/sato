import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'resourceUrlImagePipe'})
export class ResourceUrlImagePipe implements PipeTransform {
    readonly IMAGES_LOCATION = 'assets/images';

    // TODO add if condition for DevDocs domain
    transform(url: string): string {
        if (url.includes('github.com')) {
            return `${this.IMAGES_LOCATION}/Github.jpg`;
        }

        if (url.includes('reddit.com')) {
            return `${this.IMAGES_LOCATION}/Reddit.png`;
        }

        return `${this.IMAGES_LOCATION}/Resource.png`;
    }
}
