export default {
  wheelGroups: {
    wheel0: <Array<string>> process.env.WHEEL_0?.split(',') || ['@everyone'],
    not_wheel0: <Array<string>> process.env.NOT_WHEEL_0?.split(',') || [],
    wheel1: <Array<string>> process.env.WHEEL_1?.split(',') || [],
    not_wheel1: <Array<string>> process.env.NOT_WHEEL_1?.split(',') || [],
    wheel2: <Array<string>> process.env.WHEEL_2?.split(',') || [],
    not_wheel2: <Array<string>> process.env.NOT_WHEEL_2?.split(',') || [],
    admin: <Array<string>> process.env.WHEEL_ADMIN?.split(',') || ['admin'],
    not_admin: <Array<string>> process.env.NOT_WHEEL_ADMIN?.split(',') || ['admin'],
    super: <Array<string>> process.env.WHEEL_SUPER?.split(',') || [],
    not_super: <Array<string>> process.env.NOT_WHEEL_SUPER?.split(',') || [],
  },
};
