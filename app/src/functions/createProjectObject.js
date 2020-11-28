import { constants } from 'config/constants';

function createProjectObject (name) {
  return{
    name: name,
    color: constants.defaultProjectColor,
    sort: constants.defaultSort,
    showCompleted: false
  }
}

export default createProjectObject;
