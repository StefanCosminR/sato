export class ResourceSearchInput {
    offset: number;
    size: number;
    filters?: {
        pattern?: string;
    };
}
