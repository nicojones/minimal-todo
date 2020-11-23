export function time (timeStr) {
  const m = new Date(timeStr);
  return m.getUTCFullYear() + '/' + (m.getUTCMonth() + 1) + '/' + m.getUTCDate()
    + ' ' + m.getUTCHours() + ':' + m.getUTCMinutes() + ':' + m.getUTCSeconds();
}
