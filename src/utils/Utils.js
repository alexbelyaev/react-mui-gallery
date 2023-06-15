export function trunc( str, n_char ){
  return (str.length > n_char) ? str.slice(0, n_char-1) + '...' : str;
};