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

  getDrawer: (drawerKey, sort, done) => {
    const [sortField, sortDirection] = sort.split(',');
    try {
      const taskCollection = drawerService.db
        .collectionGroup('tasks')
        .where('_uids', 'array-contains', auth().currentUser.uid);
      let query;
      switch (drawerKey) {
        case urls.inboxUrl:
          query = taskCollection
            .where('checked', '==', false)
            .orderBy(sortField, sortDirection);
          break;
        case urls.priorityUrl:
          query = taskCollection
            .where('priority', '>', 0)
            .orderBy('priority', 'desc');
          break;
        default:
          cogoToast.error(text.invalidDrawer);
          done([]);
          return () => {};
      }
      //
      if (query) {

        return query.onSnapshot((tasksDoc) => {

          const tasks = [];
          tasksDoc.forEach((doc) => {
            const taskData = doc.data();

            tasks.push({
              id: doc.id,
              ...taskData
            });
          });

          done(tasks);

          console.info('Tasks in inbox: ', tasks.length);
        });
      }
    } catch (e) {
      handleError('Error on fetching drawer: ', e);
    }
  },
};

export default drawerService;
