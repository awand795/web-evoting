package com.wevoting.dto;

import java.util.List;

public class HasilResponse {
    private List<KandidatResponse> data;
    private long totalVote;

    public HasilResponse(List<KandidatResponse> data, long totalVote) {
        this.data = data;
        this.totalVote = totalVote;
    }

    public List<KandidatResponse> getData() { return data; }
    public void setData(List<KandidatResponse> data) { this.data = data; }
    public long getTotalVote() { return totalVote; }
    public void setTotalVote(long totalVote) { this.totalVote = totalVote; }
}
