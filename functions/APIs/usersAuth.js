const { admin, db } = require('../util/admin');

const { validateLoginData, validateSignUpData } = require('../util/validators');

function getUserFromData (user) {
  return {
    email: user.email,
    name: user.name,
    username: user.username,
    userId: user.uid
  };
}

// Login
// eslint-disable-next-line consistent-return
exports.loginUser = (request, response) => {

  const user = {
    email: request.body.email,
    password: request.body.password
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) {
    return response.status(400).json(errors);
  }


  let token, appUser;

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((tokenHash) => {
      token = tokenHash;
      return db.collection('users').where('email', '==', user.email).limit(1).get();
    })
    .then((snapshot) => {
      snapshot.forEach((doc) => (appUser = getUserFromData(doc.data())));
      return response.json({ token, user: appUser });
    })
    .catch((error) => {
      console.error(error);
      return response.status(403).json(
        {
          message: 'Wrong credentials'
        }
      );
    });
};

// Sign up
// eslint-disable-next-line consistent-return
exports.signUpUser = (request, response) => {

  const newUser = {
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    confirm: request.body.confirm,
    username: request.body.username
  };

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) return response.status(400).json(errors);

  let token, appUser;

  db
    .doc(`/${ col.users }/${ newUser.username }`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response.status(400).json({ username: `Username ${ newUser.username } already taken` });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
          );
      }
    })
    .then((data) => {
      newUser.uid = data.user.uid;
      appUser = getUserFromData(newUser);

      return data.user.getIdToken();
    })
    .then((tokenHash) => {
      token = tokenHash;
      const userCredentials = {
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: appUser.userId
      };

      // Create user and set data
      return db.doc(`/${ col.users }/${ newUser.username }`).set(userCredentials);
    })
    .then(() => {
      // Return a message to the app.
      return response.status(200).json({
        // token,
        // user: appUser
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return response.status(400).json({ email: 'Email already in use' });
      } else {
        return response.status(500).json({ general: 'Something went wrong, please try again' });
      }
    });
};

deleteImage = (imageName) => {
  const bucket = admin.storage().bucket();
  const path = `${ imageName }`;
  return bucket.file(path).delete()
    .then(() => {

    })
    .catch((error) => {
      return;
    });
};

// Upload profile picture
exports.uploadProfilePhoto = (request, response) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');
  const busboy = new BusBoy({ headers: request.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
      return response.status(400).json({ error: 'Wrong file type submited' });
    }
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFileName = `${ request.user.username }.${ imageExtension }`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = {
      filePath,
      mimetype
    };
    file.pipe(fs.createWriteStream(filePath));
  });
  deleteImage(imageFileName);
  busboy.on('finish', () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${ config.storageBucket }/o/${ imageFileName }?alt=media`;
        return db.doc(`/users/${ request.user.username }`).update({
          imageUrl
        });
      })
      .then(() => {
        return response.json({ message: 'Image uploaded successfully' });
      })
      .catch((error) => {
        console.error(error);
        return response.status(500).json({ error: error.code });
      });
  });
  busboy.end(request.rawBody);
};

exports.getUserDetail = (request, response) => {
  let userData = {};
  db
    .doc(`/users/${ request.user.username }`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.userCredentials = doc.data();
        return response.json(userData);
      }
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

exports.updateUserDetails = (request, response) => {
  let document = db.collection('users').doc(`${ request.user.username }`);
  document.update(request.body)
    .then(() => {
      response.json({ message: 'Updated successfully' });
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({
        message: 'Cannot Update the value'
      });
    });
};
