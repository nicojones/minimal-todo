import {Identifiable} from "./identifiable.interface";

export interface PbResult<T = any> {
  items: PbItem<T>[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PbExtra<T = any> extends Identifiable {
  "@collectionId": string;
  "@collectionName": string;
  "@expand": Partial<T>;
}

export type PbItem<T = any> = T & PbExtra<T>;

export type PocketbaseDataItem<T = any> = { data: T } & PbExtra<T>;
