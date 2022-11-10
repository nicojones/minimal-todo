export type ID = string;

export interface Identifiable<DateType = number> {
  id: ID;
  created: DateType;
  updated: DateType | null;
}
