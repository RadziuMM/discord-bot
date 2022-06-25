import { Message, TextChannel } from 'discord.js';
import { createMessage } from '../../../util/messages';
import { i18n } from '../../../i18n';
import { hasPermissions, isAllowed } from '../../../guard';
import Wheel from '../../../guard/enum/group.enum';
import Permission from '../../../guard/enum/permission.enum';

const help = async (
  message: Message,
  tasks: Record<string, any>,
  commands: Record<string, string>,
): Promise<void> => {
  if (
    !await isAllowed(message, [
      Wheel.WHEEL0,
      Wheel.WHEEL1,
      Wheel.WHEEL2,
      Wheel.ADMIN,
      Wheel.SUPER,
    ]) || !await hasPermissions(message, [Permission.WRITE])
  ) return;

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
