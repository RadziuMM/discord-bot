import { Factory } from './factory.interface';
import Permission from '../enum/permission.enum';
import Wheel from '../enum/group.enum';

const factory: Factory = {
  'task-deleteMessages': {
    userGroups: [Wheel.ADMIN, Wheel.SUPER],
    premmisions: [Permission.WRITE],
  },
  'task-help': {
    userGroups: [Wheel.WHEEL0, Wheel.WHEEL1, Wheel.WHEEL2, Wheel.ADMIN, Wheel.SUPER],
    premmisions: [Permission.WRITE],
  },
  'task-move': {
    userGroups: [Wheel.WHEEL2, Wheel.ADMIN, Wheel.SUPER],
    premmisions: [Permission.WRITE],
  },
  'task-leave': {
    userGroups: [Wheel.WHEEL1, Wheel.WHEEL2, Wheel.ADMIN, Wheel.SUPER],
    premmisions: [Permission.WRITE, Permission.SPEAK, Permission.CONNECT],
  },
  'task-play': {
    userGroups: [Wheel.WHEEL1, Wheel.WHEEL2, Wheel.ADMIN, Wheel.SUPER],
    premmisions: [Permission.WRITE, Permission.SPEAK, Permission.CONNECT],
  },
  'task-playNext': {
    userGroups: [Wheel.WHEEL1, Wheel.WHEEL2, Wheel.ADMIN, Wheel.SUPER],
    premmisions: [Permission.WRITE, Permission.SPEAK, Permission.CONNECT],
  },
  'task-showQueue': {
    userGroups: [Wheel.WHEEL1, Wheel.WHEEL2, Wheel.ADMIN, Wheel.SUPER],
    premmisions: [Permission.WRITE],
  },
  'task-skip': {
    userGroups: [Wheel.WHEEL1, Wheel.WHEEL2, Wheel.ADMIN, Wheel.SUPER],
    premmisions: [Permission.WRITE, Permission.SPEAK, Permission.CONNECT],
  },
  'task-stop': {
    userGroups: [Wheel.WHEEL1, Wheel.WHEEL2, Wheel.ADMIN, Wheel.SUPER],
    premmisions: [Permission.WRITE, Permission.SPEAK, Permission.CONNECT],
  },
};

export {
  Factory,
  factory,
};
