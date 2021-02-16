export function time (unix: number) {
  const m = new Date(unix);
  return m.getUTCFullYear() + '/' + (m.getUTCMonth() + 1) + '/' + m.getUTCDate()
    + ' ' + m.getUTCHours() + ':' + m.getUTCMinutes() + ':' + m.getUTCSeconds();
}
