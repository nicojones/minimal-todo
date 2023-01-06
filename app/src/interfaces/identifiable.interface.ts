export type ID = string;

export interface Identifiable<DateType = number, IDType = ID> {
  id: IDType;
  created: DateType;
  updated: DateType | null;
}
