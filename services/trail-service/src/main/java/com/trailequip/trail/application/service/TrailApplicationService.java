package com.trailequip.trail.application.service;

import com.trailequip.trail.domain.model.Trail;
import com.trailequip.trail.domain.repository.TrailRepository;
import com.trailequip.trail.domain.service.DifficultyClassifier;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class TrailApplicationService {

    private final TrailRepository trailRepository;
    private final DifficultyClassifier difficultyClassifier;

    public TrailApplicationService(TrailRepository trailRepository, DifficultyClassifier difficultyClassifier) {
        this.trailRepository = trailRepository;
        this.difficultyClassifier = difficultyClassifier;
    }

    public Trail createTrail(Trail trail) {
        if (trail.getDifficulty() == null) {
            trail.setDifficulty(difficultyClassifier.classify(trail));
        }
        return trailRepository.save(trail);
    }

    public Optional<Trail> getTrail(UUID id) {
        return trailRepository.findById(id);
    }

    public List<Trail> getAllTrails() {
        return trailRepository.findAll();
    }

    public List<Trail> getTrailsByDifficulty(String difficulty) {
        return trailRepository.findByDifficulty(difficulty);
    }

    public List<Trail> suggestTrailsInArea(double centerLat, double centerLon, double radiusKm, String difficulty) {
        // Note: Geographic filtering with centerLat/centerLon/radiusKm requires PostGIS
        // For now, only filtering by difficulty is implemented
        return trailRepository.findTrailsInArea(difficulty);
    }

    public Trail updateTrail(Trail trail) {
        Optional<Trail> existing = trailRepository.findById(trail.getId());
        if (existing.isPresent()) {
            Trail toUpdate = existing.get();
            if (trail.getName() != null) toUpdate.setName(trail.getName());
            if (trail.getDescription() != null) toUpdate.setDescription(trail.getDescription());
            if (trail.getDifficulty() != null) toUpdate.setDifficulty(trail.getDifficulty());
            if (trail.getDistance() > 0) toUpdate.setDistance(trail.getDistance());
            if (trail.getElevationGain() >= 0) toUpdate.setElevationGain(trail.getElevationGain());
            if (trail.getElevationLoss() >= 0) toUpdate.setElevationLoss(trail.getElevationLoss());
            if (trail.getMaxSlope() >= 0) toUpdate.setMaxSlope(trail.getMaxSlope());
            if (trail.getLatitude() != 0) toUpdate.setLatitude(trail.getLatitude());
            if (trail.getLongitude() != 0) toUpdate.setLongitude(trail.getLongitude());
            return trailRepository.save(toUpdate);
        }
        return trailRepository.save(trail);
    }

    public void deleteTrail(UUID id) {
        trailRepository.deleteById(id);
    }
}
