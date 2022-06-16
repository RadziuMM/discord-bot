import common from './common';
import help from './help';

const tasks: Record<string, any> = {
  ...common,
};

export default {
  help: help(tasks),
  ...tasks,
}
