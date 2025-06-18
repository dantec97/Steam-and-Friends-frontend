export function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
///////////////////////////// BELOW FOR TESTING PURPOSES ONLY

// export async function apiFetch(url, options = {}) {
//   const token = localStorage.getItem("token");
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       ...(options.headers || {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//   });
//   return response.json();
// }




