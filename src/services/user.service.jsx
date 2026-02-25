import { get, post, put, del } from "./api";

export function getAllUsers() {
  return get("/user");
}

export function getUserById(id) {
  return get(`/user/${id}`);
}

export function createUser(userData) {
  return post("/user", userData);
}

export function updateUser(id, userData) {
  return put(`/user/${id}`, userData);
}

export function deleteUser(id) {
  return del(`/user/${id}`);
}
