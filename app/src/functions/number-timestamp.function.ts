export const numberTimestamp = (timestamp: string | "" | null = null): number => {
  return +new Date(timestamp || new Date())
};
