export class APISearchResponse {
    head: object;
    results: {
        bindings: Array<{ url: { type: string, value: string } }>
    };
}

export class APICountResponse {
    head: object;
    results: {
        bindings: Array<{ instances: { type: string, value: string } }>
    };
}

export class APICollectResponse {
    head: object;
    results: {
        bindings: Array<{ subject: { type: string, value: string } }>
    };
}
