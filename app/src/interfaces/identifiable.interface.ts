export type ID = string;

export interface Identifiable<DateType = number, IDType = ID> {
  id: IDType;
  secret: string;
  created: DateType;
  updated: DateType | null;
}
