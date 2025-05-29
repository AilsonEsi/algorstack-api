const pendingConfirmations = {};

module.exports = {
  addToken(token, data) {
    pendingConfirmations[token] = data;
  },
  getTokenData(token) {
    return pendingConfirmations[token];
  },
  deleteToken(token) {
    delete pendingConfirmations[token];
  }
};