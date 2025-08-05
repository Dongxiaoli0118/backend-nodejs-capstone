export async function authorizedFetch(url, options = {}) {
  return fetch(url, {
    credentials: 'include',
    ...options
  });
}
