export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
  
  const response = await fetch(baseUrl + url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Check for expired token specifically
  if (response.status === 401) {
    try {
      const errorData = await response.clone().json();
      if (errorData.msg === "Token has expired") {
        // Only clear auth data for expired tokens
        localStorage.removeItem("token");
        localStorage.removeItem("steam_id");
        localStorage.removeItem("account_display_name");
        localStorage.removeItem("avatar_url");
        
        // Redirect to login
        window.location.href = "/login";
      }
    } catch (err) {
      // If we can't parse the error response, continue normally
      console.warn("Could not parse 401 error response:", err);
    }
  }

  // Always return the original response (just like your current version)
  return response;
}

// export function apiFetch(url, options = {}) {
//   const token = localStorage.getItem("token");
//   const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
//   return fetch(baseUrl + url, {
//     ...options,
//     headers: {
//       ...(options.headers || {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//   });
// }

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




