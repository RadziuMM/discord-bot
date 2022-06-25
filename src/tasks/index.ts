import help from './common/help/help';
import common from './common';
import music from './music';

const tasks: Record<string, any> = {
  ...common,
  ...music,
};

export default {
  help: help(tasks),
  ...tasks,
};
