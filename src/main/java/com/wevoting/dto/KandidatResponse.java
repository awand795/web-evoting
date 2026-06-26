package com.wevoting.dto;

public class KandidatResponse {
    private Long id;
    private String nourut;
    private String nama;
    private String foto;
    private String visi;
    private String misi;
    private String videoVisiMisi;
    private long jumlahVote;

    public KandidatResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNourut() { return nourut; }
    public void setNourut(String nourut) { this.nourut = nourut; }
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    public String getVisi() { return visi; }
    public void setVisi(String visi) { this.visi = visi; }
    public String getMisi() { return misi; }
    public void setMisi(String misi) { this.misi = misi; }
    public String getVideoVisiMisi() { return videoVisiMisi; }
    public void setVideoVisiMisi(String videoVisiMisi) { this.videoVisiMisi = videoVisiMisi; }
    public long getJumlahVote() { return jumlahVote; }
    public void setJumlahVote(long jumlahVote) { this.jumlahVote = jumlahVote; }
}
