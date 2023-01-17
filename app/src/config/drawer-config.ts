import { MinimalProject, SpecialProjectUrl } from "interfaces";
import { text } from "./text";
import { urls } from "./urls";

export const drawerConfig: Record<SpecialProjectUrl, MinimalProject> = {
  [SpecialProjectUrl.INBOX]: {
    id: urls.inboxUrl,
    name: text.drawer.inbox._,
    icon: "inbox",
    created: 0,
    updated: 0,
    color: "#2ecc71",
  },
  [SpecialProjectUrl.TODAY]: {
    id: urls.todayUrl,
    name: text.drawer.today._,
    icon: "calendar_today",
    color: "#e74c3c",
    created: 0,
    updated: 0,
  },
  [SpecialProjectUrl.PRIORITY]: {
    id: urls.priorityUrl,
    name: text.drawer.priority._,
    icon: "flag",
    color: "#9b59b6",
    created: 0,
    updated: 0,
  },
  [SpecialProjectUrl.DEADLINE]: {
    id: urls.deadlineUrl,
    name: text.drawer.deadline._,
    icon: "calendar_month",
    color: "#2980b9",
    created: 0,
    updated: 0,
  }
};

export const drawerArray = Object.values(drawerConfig);

export const drawerRequiresReload = (
  specialUrl: SpecialProjectUrl | undefined
) => [SpecialProjectUrl.PRIORITY].indexOf(specialUrl as SpecialProjectUrl) >= 0;
