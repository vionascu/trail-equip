import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [trails, setTrails] = useState<any[]>([]);
  const [selectedTrail, setSelectedTrail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/trails')
      .then(res => res.json())
      .then(data => {
        setTrails(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching trails:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#22863a' }}>TrailEquip – Bucegi Mountains</h1>

      {loading && <p>Loading trails...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        {/* Left: Trail List */}
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          <h2>Available Trails ({trails.length})</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {trails.length === 0 ? (
              <p>No trails available</p>
            ) : (
              trails.map((trail: any) => (
                <div
                  key={trail.id || trail.name}
                  onClick={() => setSelectedTrail(trail)}
                  style={{
                    padding: '10px',
                    margin: '5px 0',
                    border: selectedTrail?.id === trail.id ? '2px solid #0366d6' : '1px solid #ddd',
                    cursor: 'pointer',
                    borderRadius: '3px',
                    backgroundColor: selectedTrail?.id === trail.id ? '#f0f7ff' : '#fff'
                  }}
                >
                  <strong>{trail.name}</strong>
                  <br />
                  <small>
                    {trail.distance} km • {trail.elevationGain}m • {trail.difficulty}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Trail Details */}
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          <h2>Trail Details</h2>
          {selectedTrail ? (
            <div>
              <h3>{selectedTrail.name}</h3>
              <p>{selectedTrail.description}</p>
              <ul>
                <li>Distance: {selectedTrail.distance} km</li>
                <li>Elevation Gain: {selectedTrail.elevationGain} m</li>
                <li>Duration: {Math.round((selectedTrail.durationMinutes || 0) / 60)}h</li>
                <li>Difficulty: <strong>{selectedTrail.difficulty}</strong></li>
                <li>Hazards: {selectedTrail.hazards?.join(', ') || 'None'}</li>
                <li>Terrain: {selectedTrail.terrain?.join(', ') || 'Mixed'}</li>
              </ul>
            </div>
          ) : (
            <p>Select a trail to see details</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>✅ API Health: Check <a href="/api/v1/health" target="_blank">health endpoint</a></p>
        <p>📚 Swagger UI: Check <a href="/swagger-ui.html" target="_blank">API docs</a></p>
      </div>
    </div>
  );
}
