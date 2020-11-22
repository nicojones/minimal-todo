const { db } = require('../util/firebase');

exports.searchUserByEmail = (request, response) => {
  try {
    db
      .collection('users')
      .where('email', '==', request.body.email)
      .get()
      .then((doc) => {
        let user;
        doc.forEach((u) => {
          user = u.data();
          response.json({
            user: { name: user.name, username: user.username, userId: user.userId }
          });
        });
      })
      .catch(() => {
      });
  } catch (e) {
    response.status(500).json({ error: 'See Node.js console for details' });
    console.error('Error getting user', e);
  }
};
