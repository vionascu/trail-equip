package com.trailequip.trail.domain.model;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class Trail {

    private UUID id;
    private String name;
    private String description;
    private Double distance;
    private Integer elevationGain;
    private Integer elevationLoss;
    private Integer durationMinutes;
    private Double maxSlope;
    private Double avgSlope;
    private List<String> terrain;
    private Difficulty difficulty;
    private List<String> hazards;
    private List<Waypoint> waypoints;
    private String source;
    private Instant createdAt;
    private Instant updatedAt;

    public Trail() {}

    public Trail(String name, String description, Double distance, Integer elevationGain,
                 Integer elevationLoss, Integer durationMinutes, Double maxSlope, Double avgSlope,
                 List<String> terrain, Difficulty difficulty, List<String> hazards, String source) {
        this.name = name;
        this.description = description;
        this.distance = distance;
        this.elevationGain = elevationGain;
        this.elevationLoss = elevationLoss;
        this.durationMinutes = durationMinutes;
        this.maxSlope = maxSlope;
        this.avgSlope = avgSlope;
        this.terrain = terrain;
        this.difficulty = difficulty;
        this.hazards = hazards;
        this.source = source;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Double getDistance() { return distance; }
    public Integer getElevationGain() { return elevationGain; }
    public Integer getElevationLoss() { return elevationLoss; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public Double getMaxSlope() { return maxSlope; }
    public Double getAvgSlope() { return avgSlope; }
    public List<String> getTerrain() { return terrain; }
    public Difficulty getDifficulty() { return difficulty; }
    public List<String> getHazards() { return hazards; }
    public List<Waypoint> getWaypoints() { return waypoints; }
    public String getSource() { return source; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setId(UUID id) { this.id = id; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }
    public void setWaypoints(List<Waypoint> waypoints) { this.waypoints = waypoints; }
}
