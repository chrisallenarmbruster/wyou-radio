let sessionFlag = null;

function set(value) {
  sessionFlag = value;
}

function get() {
  return sessionFlag;
}

module.exports = { set, get };
