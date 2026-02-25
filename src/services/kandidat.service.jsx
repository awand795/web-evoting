import { get, post, put, del } from "./api";

export function getAllKandidat() {
  return get("/kandidat");
}

export function getKandidatById(id) {
  return get(`/kandidat/${id}`);
}

export function createKandidat(data) {
  return post("/kandidat", data);
}

export function updateKandidat(id, data) {
  return put(`/kandidat/${id}`, data);
}

export function deleteKandidat(id) {
  return del(`/kandidat/${id}`);
}
