import { Message, TextChannel } from 'discord.js';
import Wheel from './enum/group.enum';
import Config from '../config';
import Permission from './enum/permission.enum';
import { createMessage } from '../util/messages';
import { i18n } from '../i18n';

const inWheel = (
  user: Record<string,any>,
  group: Record<string, any>,
  wheelName: Wheel,
) => {
  const wheelGroups = Config.wheelGroups as any;
  if (wheelGroups[`not_${wheelName.toLowerCase()}`]?.includes(user.id)) {
    return false;
  } else {
    return group.includes(user.id) || user.roles.some((item: string) => group.includes(item));
  }
};

const isAllowed = async(message: Message, wheels: Wheel[]) => {
  const user = {
    id: message.author.id,
    roles: message.member?.roles.cache.map((role) => role.name),
  };

  const userWheels = [
    ...inWheel(user, Config.wheelGroups.super, Wheel.SUPER)? [Wheel.SUPER] : [],
    ...inWheel(user, Config.wheelGroups.admin, Wheel.ADMIN)? [Wheel.ADMIN] : [],
    ...inWheel(user, Config.wheelGroups.wheel0, Wheel.WHEEL0)? [Wheel.WHEEL0] : [],
    ...inWheel(user, Config.wheelGroups.wheel1, Wheel.WHEEL1)? [Wheel.WHEEL1] : [],
    ...inWheel(user, Config.wheelGroups.wheel2, Wheel.WHEEL2)? [Wheel.WHEEL2] : [],
  ];

  const result = wheels.some((item: Wheel) => userWheels.includes(item));
  if (!result) {
    await createMessage(
      message.channel as TextChannel,
      i18n('alert_message.forbidden'),
    );
  }

  return result;
}

const hasPermissions = async(message: Message, permissions: Permission[]) => {
  const voiceChannel: any = message.member?.voice?.channel;
  const msgPermissions = voiceChannel?.permissionsFor(message.client?.user);

  if (permissions.includes(Permission.SPEAK) && !msgPermissions?.has('SPEAK')) {
    await createMessage(
      message.channel as TextChannel,
      i18n('alert_message.bot_cannot_access'),
    );
    return false;
  }

  if (permissions.includes(Permission.CONNECT) && !msgPermissions?.has('CONNECT')) {
    await createMessage(
      message.channel as TextChannel,
      i18n('alert_message.bot_cannot_access'),
    );
    return false;
  }

  if (permissions.includes(Permission.WRITE) && !message?.guild?.id) {
    await createMessage(
      message.channel as TextChannel,
      i18n('alert_message.room_not_found'),
    );
    return false;
  }

  return true;
}

export {
  isAllowed,
  hasPermissions,
};