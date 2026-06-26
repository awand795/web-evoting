package com.wevoting.dto;

import jakarta.validation.constraints.NotNull;

public class VoteRequest {
    @NotNull
    private Long kandidatId;

    public Long getKandidatId() { return kandidatId; }
    public void setKandidatId(Long kandidatId) { this.kandidatId = kandidatId; }
}
