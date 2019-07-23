const myConfig = {};

myConfig.session = {
  SESS_NAME: 'sid', // sid - session id
  SESS_SECRET: 'wow! top secret!',
  SESS_LIFETIME: 1000 * 60 * 60 * 2 // null - когда браузер закрывается, кука умирает
};

export { myConfig };
