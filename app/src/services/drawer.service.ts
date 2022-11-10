import {auth, db} from './firebase';
import {urls} from '../config/urls';
import {text} from '../config/text';
import {showToast} from './toast';
import {ITask, SortDirection} from '../interfaces';
import {authService} from "./auth.service";
import {constants} from "../config";


export const drawerService = {

  db: db(),

  headers: () => {
    return {authorization: localStorage.getItem(constants.storageKey.AUTH_TOKEN)};
  },

  getDrawer: (drawerKey: string, sort: string, done: (tasks: ITask[]) => any) => {
    const [sortField, sortDirection] = sort.split(',');
    try {
      const taskCollection = drawerService.db
        .collectionGroup('tasks')
        .where('_uids', 'array-contains', (auth().currentUser as { uid: string }).uid);
      let query;
      switch (drawerKey) {
        case urls.inboxUrl:
          query = taskCollection
            .where('checked', '==', false)
            .orderBy(sortField, sortDirection as SortDirection);
          break;
        case urls.priorityUrl:
          query = taskCollection
            .where('priority', '>', 0)
            .orderBy('priority', 'desc');
          break;
        default:
          showToast('error', text.drawer.invalidDrawer);
          done([]);
          return () => {
          };
      }
      //
      if (query) {

        return query.onSnapshot((tasksDoc) => {

          const tasks: ITask[] = [];
          tasksDoc.forEach((doc) => {
            const taskData = doc.data();

            tasks.push({
              id: doc.id,
              ...taskData
            } as ITask);
          });

          done(tasks);

          console.info('Tasks in inbox: ', tasks.length);
        });
      }
    } catch (e) {
      authService.handleError('Error on fetching drawer: ', e);
    }
  },
};
