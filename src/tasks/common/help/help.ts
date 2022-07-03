import { Message, TextChannel } from 'discord.js';
import { createMessage } from '../../../util/messages';
import { mayUse } from '../../../guard';
import { i18n } from '../../../i18n';

const help = async (
  message: Message,
  tasks: Record<string, any>,
  commands: Record<string, string>,
): Promise<void> => {
  if (!await mayUse('task-help', message)) return;

  let helpMsg = `${i18n('command_description.header')} \n`;
  helpMsg += `**${commands.fullComand}/${commands.shortcut}** - ${i18n('command_description.help')} \n`;

  Object.keys(tasks).forEach((key: string) => {
    helpMsg += `**${tasks[key].fullComand}/${tasks[key].shortcut}** - ${tasks[key].description} \n`;
  });

  await createMessage(
    message.channel as TextChannel,
    helpMsg,
    { timeout: 15 * 1000 },
  );
};

export default (tasks: Record<string, any>): Record<string, any> => {
  const commands = {
    fullComand: 'help',
    shortcut: 'h',
  };

  return {
    ...commands,
    description: i18n('command_description.help'),
    method: (message: Message) => help(
      message,
      tasks,
      commands,
    ),
  };
};
