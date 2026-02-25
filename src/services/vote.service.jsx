import { post, get } from "./api";

export function castVote(kandidatId) {
  return post("/vote", { kandidatId });
}

export function getVoteStatus() {
  return get("/vote/status");
}

export function getHasil() {
  return get("/hasil");
}
