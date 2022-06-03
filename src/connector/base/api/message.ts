import { TextMessage } from '../../../core/message';
import { BaseApi } from './base';

export abstract class MessageApi extends BaseApi {
    abstract create(
        channelId: string,
        content: unknown,
        configs?: unknown
    ): Promise<TextMessage>;

    abstract view(messageId: string): Promise<TextMessage>;
    abstract update(
        messageId: string,
        content: unknown,
        configs?: unknown
    ): Promise<TextMessage>;

    abstract delete(messageId: string): void;
}
