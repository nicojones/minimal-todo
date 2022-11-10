import MessageData from "pocketbase";
import {PbItem} from "./pb-result.interface";

export interface PbRealtitmeAction<T = any> extends MessageData {
  action: "update" | "insert" | "delete",
  record: PbItem<T>;
}
