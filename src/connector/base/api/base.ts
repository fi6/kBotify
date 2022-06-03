import { BaseConnector } from '..';

export abstract class BaseApi {
    private readonly client: BaseConnector;
    constructor(client: BaseConnector) {
        this.client = client;
    }
}
