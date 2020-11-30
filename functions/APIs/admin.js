const { db, admin } = require('../util/firebase');

module.exports._fixtures = (request, response) => {
  const user = {
    name: 'Nico Kupfer',
    email: 'nico@kupfer.es',
    password: '1f8ac10f23c5b5bc1167bda84b833e5c057a77d2',
    confirm: '1f8ac10f23c5b5bc1167bda84b833e5c057a77d2',
    username: 'nicoJ'
  };

  admin
    .auth()
    .createUser({
      email: user.email,
      displayName: user.name,
      password: user.password
    })

    .then((data) => {
      user.userId = data.uid;
      delete user.password;

      // Create user and set data
      return db.doc(`/users/${ user.username }`).set(user);
    })
    .then(() => {
      const newProject = {
        name: 'Project 1 fixtures',
        color: '#abcdef',
        sort: '_name_lower,desc',
        showCompleted: true,
        _uids: [user.userId]
      }
      return db.collection('/projects').add(newProject);
    })
    .then((proj) => {
      const id = proj.id;
      response.status(200).json({ message: 'SUCCESS'})
    })
    .then(() => {
    })
    .catch((err) => {
      console.error(err);
    });

}
