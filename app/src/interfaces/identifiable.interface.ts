export type ID = string;

export interface Identifiable<DateType = number, IDType = ID> {
  id: string;
  created: DateType;
  updated: DateType | null;
}
