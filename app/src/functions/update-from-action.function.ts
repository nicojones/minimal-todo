import {PbRealtitmeAction} from "../interfaces";
import {Identifiable} from "../interfaces/identifiable.interface";

export const updateFromAction = <T extends Identifiable = Identifiable>(
  collection: T[],
  action: PbRealtitmeAction
): T[] => {
  if (action.action === "update") {
    return collection.map((c: T) => {
      if (action.record.id === c.id) {
        return action.record
      }
      return c
    })
  }

  if (action.action === 'delete') {
    collection.filter((c: T) => c.id !== action.record.id)
  }

  if (action.action === 'insert') {
    return [...collection, action.record];
  }

  return collection;
}
