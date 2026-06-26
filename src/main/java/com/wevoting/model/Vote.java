package com.wevoting.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "votes",
       uniqueConstraints = @UniqueConstraint(columnNames = "user_id"))
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "kandidat_id", nullable = false)
    private Kandidat kandidat;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Vote() {}

    public Vote(User user, Kandidat kandidat) {
        this.user = user;
        this.kandidat = kandidat;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Kandidat getKandidat() { return kandidat; }
    public void setKandidat(Kandidat kandidat) { this.kandidat = kandidat; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
