const { db, admin } = require('../util/firebase');
const config = require('../util/config');

const { validateSignUpData } = require('../util/validators');

function getUserFromData (user) {
  return {
    email: user.email,
    name: user.name,
    username: user.username,
    userId: user.uid
  };
}

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
    .doc(`/users/${ newUser.username }`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response.status(400).json({ username: `Username ${ newUser.username } already taken` });
      } else {
        return admin.auth()
          .createUser({
            email: newUser.email,
            displayName: newUser.name,
            password: newUser.password
          });
      }
    })
    .then((data) => {
      appUser = getUserFromData(newUser);

      const userCredentials = {
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: data.uid
      };

      // Create user and set data
      return db.doc(`/users/${ newUser.username }`).set(userCredentials);
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
