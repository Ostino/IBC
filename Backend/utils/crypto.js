const crypto = require('crypto');

function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

function hashPassword(password, salt) {
  const hash = crypto.createHmac('sha1', salt).update(password).digest('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, hashedPassword) {
  const [salt, originalHash] = hashedPassword.split(':');
  const hashToVerify = crypto.createHmac('sha1', salt).update(password).digest('hex');
  return originalHash === hashToVerify;
}

function generateToken(username, email) {
  const salt = generateSalt(12);
  const rawToken = `${username}:${email}:${Date.now()}`;
  const token = crypto.createHmac('sha1', salt).update(rawToken).digest('hex');
  return token;
}

module.exports = {
  generateSalt,
  hashPassword,
  verifyPassword,
  generateToken
};
