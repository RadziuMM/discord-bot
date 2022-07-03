import Wheel from '../enum/group.enum';
import Permission from '../enum/permission.enum';

export interface Factory {
  [index: string]: { userGroups: Wheel[], premmisions: Permission[] }
}
