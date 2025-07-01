// export async function apiFetch(url, options = {}) {
//   const token = localStorage.getItem("token");
//   const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

//   const res = await fetch(baseUrl + url, {
//     ...options,
//     headers: {
//       ...(options.headers || {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//   });

//   if (res.status === 401) {
//     // Token is invalid or expired
//     localStorage.removeItem("token");
//     localStorage.removeItem("steam_id");
//     localStorage.removeItem("account_display_name");
//     localStorage.removeItem("avatar_url");

//     // Redirect to login page
//     window.location.href = "/login";
//     return null;
//   }

//   // Return parsed JSON by default
//   try {
//     return await res.json();
//   } catch (err) {
//     console.error("Failed to parse JSON:", err);
//     return null;
//   }
// }

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




