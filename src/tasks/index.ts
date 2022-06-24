import common from './common';
import music from './music';

const tasks: Record<string, any> = {
  ...common,
  ...music,
};

import help from './common/help/help';

export default {
  help: help(tasks),
  ...tasks,
}
