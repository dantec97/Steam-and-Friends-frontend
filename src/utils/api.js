export function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
  return fetch(baseUrl + url, {
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




