import { get, put } from "./api";

export function getSettings() {
  return get("/settings");
}

export function updateSettings(id, data) {
  return put(`/settings/${id}`, data);
}

export function getSchedule() {
  return get("/settings/public");
}
