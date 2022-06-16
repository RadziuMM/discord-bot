import { Message } from 'discord.js';
import Wheel from './group.enum';
import Config from '../config';

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

export default (message: Message, wheels: Wheel[]) => {
  const user = {
    id: message.author.id,
    roles: message.member?.roles.cache.map((role) => role.name),
  };

  const userWheels = [
    ...inWheel(user, Config.wheelGroups.super, Wheel.super)? [Wheel.super] : [],
    ...inWheel(user, Config.wheelGroups.admin, Wheel.admin)? [Wheel.admin] : [],
    ...inWheel(user, Config.wheelGroups.wheel0, Wheel.wheel0)? [Wheel.wheel0] : [],
    ...inWheel(user, Config.wheelGroups.wheel1, Wheel.wheel1)? [Wheel.wheel1] : [],
    ...inWheel(user, Config.wheelGroups.wheel2, Wheel.wheel2)? [Wheel.wheel2] : [],
  ];

  return wheels.some((item: Wheel) => userWheels.includes(item));
};