import { auth, db } from './firebase';
import { handleError } from './handleError';
import cogoToast from 'cogo-toast';
import { urls } from '../config/urls';
import { text } from '../config/text';

const drawerService = {

  db: db(),

  headers: () => {
    return { authorization: localStorage.getItem('AuthToken') };
  },

  getDrawer: async (drawerKey, done) => {
    try {
      switch (drawerKey) {
        case urls.inboxUrl:
          done([]);
          return () => {};
          // return drawerService.db
          //   .collection(`/projects`)
          //   .where('_uids', 'array-contains', auth().currentUser.uid)
          //   // .orderBy('timestamp', 'desc')
          //   .onSnapshot((projectsDoc) => {
          //
          //     const projects = [];
          //     projectsDoc.forEach((doc) => {
          //       const projectData = doc.data();
          //       projects.push({
          //         id: doc.id,
          //         name: projectData.name,
          //         shared: projectData.shared,
          //         showCompleted: projectData.showCompleted,
          //         color: projectData.color
          //       });
          //     });
          //
          //     // done([...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects, ...projects]);
          //     done(projects);
          //
          //     console.info('Lists loaded: ', projects.length);
          //   });
        default:
          cogoToast.error(text.invalidDrawer);
          return () => {
          };
      }
    } catch (e) {
      handleError('Error on fetching drawer: ', e);
    }
  },
};

export default drawerService;
