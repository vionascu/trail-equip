package com.trailequip.trail.domain.repository;

import com.trailequip.trail.domain.model.Trail;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TrailRepository {
    Trail save(Trail trail);
    Optional<Trail> findById(UUID id);
    List<Trail> findAll();
    List<Trail> findByDifficulty(String difficulty);
    List<Trail> findTrailsInArea(double centerLat, double centerLon, double radiusKm, String difficulty);
    void delete(UUID id);
}
