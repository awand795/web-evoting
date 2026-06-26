package com.wevoting.repository;

import com.wevoting.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    Long countByKandidatId(Long kandidatId);
    List<Vote> findByKandidatId(Long kandidatId);

    @Query("SELECT v.kandidat.id, COUNT(v) FROM Vote v WHERE v.kandidat.id IN :kandidatIds GROUP BY v.kandidat.id")
    List<Object[]> countVotesByKandidatIds(@Param("kandidatIds") List<Long> kandidatIds);
}
