const { db } = require('../util/firebase');

exports.searchUserByEmail = (request, response) => {
  try {
    db
      .collection('users')
      .where('email', '==', request.body.email)
      .get()
      .then((doc) => {
        let user;
        let foundUsers = false;
        doc.forEach((u) => {
          foundUsers = true;
          user = u.data();
          response.json({
            user: { name: user.name, username: user.username, userId: user.userId }
          });
        });
        if (!foundUsers) {
          throw new Error(`No user with email ${ request.body.email }`);
        }
      })
      .catch((e) => {
        response.status(404).json({
          message: e.message
        })
      });
  } catch (e) {
    response.status(500).json({ error: 'See Node.js console for details' });
    console.error('Error getting user', e);
  }
};
