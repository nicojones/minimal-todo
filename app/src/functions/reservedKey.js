import { urls } from 'config/urls';

function reservedKey (projectKey) {
  return [urls.inboxUrl, urls.priorityUrl].indexOf(projectKey) >= 0;
}

export default reservedKey;
