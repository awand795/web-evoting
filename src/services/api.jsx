const BASE_URL = "http://localhost:8080/api";

function getToken() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.accessToken || null;
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["x-access-token"] = token;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Sesi berakhir, silakan login kembali");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan");
  }

  return data;
}

export function get(endpoint) {
  return request(endpoint, { method: "GET" });
}

export function post(endpoint, body) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function put(endpoint, body) {
  return request(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function del(endpoint) {
  return request(endpoint, { method: "DELETE" });
}
