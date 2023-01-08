import { urls } from "config";

export const drawerProjectFunction = (projectKey: string): string => {
    switch(projectKey) {
        case urls.inboxUrl:
            return "inbox";
        case urls.priorityUrl:
            return "flag";
        default:
            return "";
    }
}