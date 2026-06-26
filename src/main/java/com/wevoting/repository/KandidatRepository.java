package com.wevoting.repository;

import com.wevoting.model.Kandidat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KandidatRepository extends JpaRepository<Kandidat, Long> {
    List<Kandidat> findAllByOrderByNourutAsc();
}
