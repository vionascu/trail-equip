package com.trailequip.trail.domain.repository;

import com.trailequip.trail.domain.model.Trail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrailRepository extends JpaRepository<Trail, UUID> {
    List<Trail> findByDifficulty(String difficulty);

    @Query(value = "SELECT * FROM trails WHERE difficulty = :difficulty OR :difficulty IS NULL ORDER BY name", nativeQuery = true)
    List<Trail> findTrailsInArea(@Param("centerLat") double centerLat,
                                 @Param("centerLon") double centerLon,
                                 @Param("radiusKm") double radiusKm,
                                 @Param("difficulty") String difficulty);
}
