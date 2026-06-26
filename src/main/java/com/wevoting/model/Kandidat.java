package com.wevoting.model;

import jakarta.persistence.*;

@Entity
@Table(name = "kandidats")
public class Kandidat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nourut")
    private String nourut;

    @Column(name = "nama")
    private String nama;

    @Column(name = "foto")
    private String foto;

    @Column(name = "video_visi_misi")
    private String videoVisiMisi;

    @Column(name = "visi", columnDefinition = "TEXT")
    private String visi;

    @Column(name = "misi", columnDefinition = "TEXT")
    private String misi;

    public Kandidat() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNourut() { return nourut; }
    public void setNourut(String nourut) { this.nourut = nourut; }
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    public String getVideoVisiMisi() { return videoVisiMisi; }
    public void setVideoVisiMisi(String videoVisiMisi) { this.videoVisiMisi = videoVisiMisi; }
    public String getVisi() { return visi; }
    public void setVisi(String visi) { this.visi = visi; }
    public String getMisi() { return misi; }
    public void setMisi(String misi) { this.misi = misi; }
}
