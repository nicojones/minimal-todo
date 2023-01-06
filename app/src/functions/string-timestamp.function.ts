export const stringTimestamp = (timestamp: number | undefined | null = null): string => {
  return (new Date(timestamp || new Date())).toISOString()
};
