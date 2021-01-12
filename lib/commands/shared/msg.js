"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppMsgSender = void 0;
const KBot_1 = require("init/KBot");
const types_1 = require("kaiheila-bot-root/dist/types");
const mention_by_id_1 = require("../../utils/mention-by-id");
const app_1 = require("./app");
const types_2 = require("./types");
class AppMsgSender {
    constructor(withMention = false, withReply = false, replyChannelId, messageType = types_1.MessageType.kmarkdown) {
        this.withMention = false;
        this.withReply = false;
        this.messageType = types_1.MessageType.kmarkdown;
        this.bot = new KBot_1.KBotify({
            mode: 'webhook',
            token: 'token',
            ignoreDecryptError: true,
        });
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        this.wrongArgs = async (data, resultType = types_2.ResultTypes.WRONG_ARGS) => {
            const content = `输入的参数数量不正确。如需查看帮助，请直接输入\`[命令] [帮助]\`, 如：\`.账户 绑定 帮助\``;
            return this.send(content, data, resultType, {
                reply: true,
                mention: true,
            });
        };
        /**
         * Reply with mention with default message type of msgSender.
         *
         * @param content content of the message. By default it's in kmarkdown.
         * @param data data.
         * @param [resultType] Optional. If you would like to track the result of your command, please specify. Otherwise it will return success by default.
         */
        this.reply = async (content, data, resultType = types_2.ResultTypes.SUCCESS) => {
            return this.send(content, data, resultType, {
                reply: true,
                mention: true,
            });
        };
        this.replyWithoutMention = async (content, data, resultType = types_2.ResultTypes.SUCCESS) => {
            return this.send(content, data, resultType, {
                reply: true,
                mention: false,
            });
        };
        this.mention = async (content, data, resultType = types_2.ResultTypes.SUCCESS) => {
            return this.send(content, data, resultType, {
                reply: false,
                mention: true,
            });
        };
        this.sendOnly = async (content, data, resultType = types_2.ResultTypes.SUCCESS) => {
            return this.send(content, data, resultType, {
                reply: false,
                mention: false,
            });
        };
        this.send = async (content, data, resultType = types_2.ResultTypes.SUCCESS, sendOptions) => {
            if (typeof content !== 'string')
                content = await content();
            //decide if msg should be sent in specific channel.
            let replyChannelId = data.msg.channelId;
            if (this.replyChannelId)
                replyChannelId = this.replyChannelId;
            if (sendOptions === null || sendOptions === void 0 ? void 0 : sendOptions.replyAt)
                replyChannelId = sendOptions.replyAt;
            // decide if need mention at the start.
            const withMention = (sendOptions === null || sendOptions === void 0 ? void 0 : sendOptions.mention) !== undefined
                ? sendOptions.mention
                : this.withMention;
            const msgType = (sendOptions === null || sendOptions === void 0 ? void 0 : sendOptions.msgType) !== undefined
                ? sendOptions.msgType
                : this.messageType;
            const msgSent = this.bot.sendChannelMessage(msgType, replyChannelId, (withMention ? `${mention_by_id_1.mentionById(data.msg.authorId)} ` : '') + content, (sendOptions === null || sendOptions === void 0 ? void 0 : sendOptions.reply) ? data.msg.msgId : undefined);
            return app_1.initFuncResult(data, resultType, msgSent);
        };
        if (replyChannelId)
            this.replyChannelId = replyChannelId;
        if (withMention === false)
            this.withMention = false;
        if (withReply === false)
            this.withReply = false;
        if (messageType)
            this.messageType = messageType;
    }
}
exports.AppMsgSender = AppMsgSender;
//# sourceMappingURL=msg.js.map