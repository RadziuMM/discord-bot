import { Message, TextChannel } from 'discord.js';
import { createMessage } from '../util/messages';
import { i18n } from '../i18n';
import guard from '../guard';
import Wheel from '../guard/group.enum';

const help = async(
  message: Message,
  tasks: Record<string, any>,
  commands: Record<string, string>,
) => {
  if (!guard(message, [Wheel.wheel2])) {
    return createMessage(
      message.channel as TextChannel,
      i18n('alertMessage.msg403'),
      {},
    );
  }

  let helpMsg = `${i18n('commandDescription.header')} \n`;
  helpMsg += `***1.*** ${commands.fullComand}/${commands.shortcut} ${i18n('commandDescription.help')} \n`

  Object.keys(tasks).forEach((key: string, index: number) => {
    helpMsg += `***${index + 2}.*** ${tasks[key].fullComand}/${tasks[key].shortcut} ${tasks[key].description}`
  })

  await createMessage(
    message.channel as TextChannel,
    helpMsg,
    { timeout: 20 },
  );
};

export default (tasks: Record<string, any>): Record<string, any> => {
  const commands = {
    fullComand: 'help',
    shortcut: 'h',
  }

  return {
    ...commands,
    description: i18n('commandDescription.help'),
    method: (message: Message) => help(
      message,
      tasks,
      commands,
    ),
  };
};
