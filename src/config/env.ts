export default {
  prefix: <string>process.env.PREFIX || '!',
  token: <string>process.env.TOKEN || null,
  ytAPIkey: <string>process.env.YT_APIKEY || null,
  ytCookie: <string>process.env.YT_COOKIE || null,
  debug: <string>process.env.DEBUG === 'true',
};
