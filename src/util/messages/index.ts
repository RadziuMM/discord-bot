import { v1 as uuidv1 } from 'uuid';
import { Message, TextChannel } from 'discord.js';
import { MessageConstruct } from './interface/message-construct.interface';
import { i18n } from '../../i18n';

const mappedMessages: Map<string, MessageConstruct> = new Map();
const interval = parseInt(<string>process.env.MESSAGE_INTERVAL, 10) * 1000 || 5 * 1000;
const timeout = parseInt(<string>process.env.MESSAGE_TIMEOUT, 10) * 1000 || 10 * 1000;

const deleteMessage = async (id: string) => {
  const element = mappedMessages.get(id);
  if (!element) return;

  if (element.deleteAfter > 0) {
    element.deleteAfter = 0;
  } else {
    mappedMessages.delete(id);
    try {
      await element.message.delete();
      mappedMessages.delete(id);
    } catch (_error: unknown) { /* mute not found error */ }
  }
};

const editMessage = async (
  id: string,
  content?: string,
  options?: Record<string, undefined | number>,
) => {
  const element = mappedMessages.get(id);
  if (!element) return false;

  try {
    if (content) await element.message.edit(content);
    if (options?.timeout) element.options.timeout = options.timeout;
    mappedMessages.set(id, element);
  } catch (_error) {
    await deleteMessage(id);
  }
};

const intervalContent = async (id: string) => {
  const messageInterval = setInterval(async () => {
    const element: MessageConstruct = mappedMessages.get(id) as MessageConstruct;
    element.deleteAfter -= interval;
    if (element.deleteAfter <= 0) {
      clearInterval(messageInterval);
      await deleteMessage(id);
    } else if (element.options?.countdown) {
      await editMessage(id, i18n('message.left', {
        time: new Date(element.deleteAfter).toISOString().substring(11, 19),
        text: element.options?.countdown,
      }));
    }
    mappedMessages.set(id, element);
  }, interval);
};

const createMessage = async (
  textChannel: TextChannel,
  content: string,
  options: Record<string, any> = {},
) => {
  const id = uuidv1();
  await textChannel.send(content).then((message: Message) => {
    mappedMessages.set(id, {
      id,
      textChannel,
      message,
      deleteAfter: options.timeout || timeout,
      options,
      intervalFunction: () => intervalContent(id),
    });
    mappedMessages.get(id)?.intervalFunction();
  });
  return id;
};

export {
  createMessage,
  editMessage,
  deleteMessage,
  timeout,
  interval,
};
