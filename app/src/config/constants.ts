import { SpecialProjectUrl } from "interfaces";
import { text } from "./text";
// import {CTOptions} from 'cogo-toast';

export const projectSort = {
  OLDEST_FIRST: "OLDEST_FIRST",
  Z_TO_A: "Z_TO_A",
  A_TO_Z: "A_TO_Z",
  NEWEST_FIRST: "NEWEST_FIRST",
  PRIORITY: "PRIORITY",
  DEADLINE: "DEADLINE",
};

export const priorityIcons: string[] = ["flag", "flag", "flag", "flag"];

export const projectIcons = {
  star: "grade",
  heart: "favorite",
  home: "home",
  public: "public",
  rocket: "rocket",
  smiley: "mood",
  navigation: "navigation",
  // calendarToday: "calendar_today",
  // calendarMonth: "calendar_month",
  puzzle: "extension",
  sun: "sunny",
  lightbulb: "lightbulb",
  comment: "comment",
  mountain: "landscape",
  tool: "building",
  photo: "photo",
};
export const projectIconsArray = Object.values(projectIcons);

export const sortOptionIcons = {
  [projectSort.A_TO_Z]: "sort_by_alpha",
  [projectSort.Z_TO_A]: "sort_by_alpha",
  [projectSort.OLDEST_FIRST]: "arrow_downward",
  [projectSort.NEWEST_FIRST]: "arrow_upward",
  [projectSort.PRIORITY]: "flag",
  [projectSort.DEADLINE]: "calendar_month",
}

export const constants = {
  defaultProjectColor: "#aaa",
  toast: {
    position: "bottom-center",
    renderIcon: () => "",
    onClick: () => (window as any).hideCogoToast(),
  } as any,
  maxDepth: 10,
  defaultSort: projectSort.OLDEST_FIRST,
  sortOptions: [
    { icon: "sort_by_alpha", name: text.sort.az, sort: projectSort.A_TO_Z },
    { icon: "sort_by_alpha", name: text.sort.za, sort: projectSort.Z_TO_A },
    {
      icon: "arrow_downward",
      name: text.sort.of,
      sort: projectSort.OLDEST_FIRST,
    },
    {
      icon: "arrow_upward",
      name: text.sort.nf,
      sort: projectSort.NEWEST_FIRST,
    },
    { icon: "calendar_month", name: text.sort.dd, sort: projectSort.DEADLINE },
    { icon: "flag", name: text.sort.pr, sort: projectSort.PRIORITY },
  ],
  drawerSort: {
    [SpecialProjectUrl.INBOX]: projectSort.OLDEST_FIRST,
    [SpecialProjectUrl.PRIORITY]: projectSort.PRIORITY,
  },
  storageKey: {
    PB_USER: "PB_USER",
    AUTH_TOKEN: "AUTH_TOKEN",
  },
  alertFormat: "dd/mm/yyyy 'at' HH:MM",
  deadlineFormat: "dd/mm/yyyy",
  deadlineTooltipFormat: "dd/mm/yyyy 'at' HH:MM"
};
