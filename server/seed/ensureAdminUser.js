const User = require('../models/User');

const ensureAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Platform Admin';

  if (!email || !password) {
    return { created: false, skipped: true };
  }

  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      return { created: false, promoted: true, skipped: false };
    }

    return { created: false, skipped: true };
  }

  await User.create({
    name,
    email,
    password,
    role: 'admin',
  });

  return { created: true, skipped: false };
};

module.exports = ensureAdminUser;
