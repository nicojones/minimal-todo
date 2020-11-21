export async function sha1( str ) {
  const buffer = new TextEncoder('utf-8').encode( str );
  const digest = await crypto.subtle.digest('SHA-1', buffer);

  // Convert digest to hex string
  return Array.from(new Uint8Array(digest)).map( x => x.toString(16).padStart(2,'0') ).join('');
}
