import { urls } from 'config/urls';


export function reservedKey (projectKey: string) {
  return [urls.inboxUrl, urls.priorityUrl].indexOf(projectKey) >= 0;
}
