export class ResourceSearchInput {
    offset: number;
    size: number;
    filters?: {
        programmingLanguages?: Array<string>;
        includedTopics?: Array<string>;
        excludedTopics?: Array<string>;
        resourceTypes?: Array<string>;
        languages?: Array<string>;
        platforms?: Array<string>;
        pattern?: string;
        dateRange?: {
            startDate?: Date;
            endDate?: Date;
        }
    };
}
