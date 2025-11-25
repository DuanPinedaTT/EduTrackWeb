const DEFAULT_API_URL = "https://localhost:5001";

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || DEFAULT_API_URL;
const SESSION_STORAGE_KEY = "edutrack-token";

async function request(path, { method = "GET", body, token, headers, responseType = "auto" } = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const finalHeaders = {
    "Content-Type": "application/json",
    ...(headers ?? {}),
  };

  const bearerToken = token || localStorage.getItem(SESSION_STORAGE_KEY);
  if (bearerToken) {
    finalHeaders.Authorization = `Bearer ${bearerToken}`;
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  let payload;
  if (responseType === "blob") {
    payload = await response.blob();
  } else if (responseType === "text") {
    payload = await response.text();
  } else {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      payload = await response.json();
    } else if (contentType.includes("application/octet-stream") || contentType.includes("application/vnd")) {
      payload = await response.blob();
    } else {
      payload = await response.text();
    }
  }

  if (!response.ok) {
    const message =
      typeof payload === "string" && payload
        ? payload
        : payload && typeof payload === "object"
          ? payload?.title || payload?.errors
          : response.statusText;
    throw new Error(typeof message === "string" ? message : "Ocurrió un error inesperado");
  }

  return payload;
}

export const apiClient = {
  get: (path, options = {}) => request(path, { ...options, method: "GET" }),
  post: (path, body, options = {}) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options = {}) => request(path, { ...options, method: "PUT", body }),
  del: (path, options = {}) => request(path, { ...options, method: "DELETE" }),
  download: (path, options = {}) => request(path, { ...options, method: options.method ?? "GET", responseType: "blob" }),
  SESSION_STORAGE_KEY,
};
