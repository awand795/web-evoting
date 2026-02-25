import { post } from "./api";

export async function login(username, password) {
  const data = await post("/auth/signin", { username, password });
  localStorage.setItem("user", JSON.stringify(data));
  return data;
}

export async function register({ name, username, email, password }) {
  return post("/auth/signup", { name, username, email, password });
}

export function logout() {
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}
