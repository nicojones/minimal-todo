import {PbRealtitmeAction} from "../interfaces";
import {pbClient} from "../services";

export const realtimeSubscription = (
  collection: string,
  done: (action: PbRealtitmeAction) => any
): (() => any) => {
  pbClient.realtime.subscribe(collection, (data: any) => {
    done(data as PbRealtitmeAction);
  });
  return () => 0
  // return () => pbClient.realtime.unsubscribe(collection);
}
