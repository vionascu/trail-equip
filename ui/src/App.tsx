import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Component to handle map invalidation
function MapInvalidator({ selectedTrail }: { selectedTrail: any }) {
  const map = useMap();

  useEffect(() => {
    // Invalidate map size and fit bounds after state changes
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map, selectedTrail]);

  return null;
}

// Fix for Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Bucegi Mountains Hiking Trails - 11 Major Routes with GPS Data
const BUCEGI_TRAILS = [
  {id:'1',name:'Omu Peak Direct',description:'Direct ascent to Omu Peak (2504m) via Plaiul Foii',distance:8.2,elevationGain:680,elevationLoss:680,durationMinutes:240,maxSlope:42.0,avgSlope:18.5,terrain:['forest','meadow','rocky'],difficulty:'MEDIUM',hazards:['exposure'],source:'osm',latitude:45.3585,longitude:25.5050,waypoints:[[45.3200,25.4800],[45.3280,25.4850],[45.3350,25.4920],[45.3420,25.4980],[45.3480,25.5020],[45.3540,25.5040],[45.3585,25.5050]],trailMarking:'YELLOW_RECTANGLE',isCircular:false,description_extended:'Highest peak in Bucegi with 360° panoramic views'},
  {id:'2',name:'Sphinx Peak Scramble',description:'Rock scramble to distinctive Sphinx formation',distance:6.5,elevationGain:520,elevationLoss:520,durationMinutes:280,maxSlope:58.0,avgSlope:32.0,terrain:['rock','scramble'],difficulty:'ROCK_CLIMBING',hazards:['exposure','loose_rock'],source:'osm',latitude:45.3428,longitude:25.5142,waypoints:[[45.3350,25.5000],[45.3380,25.5050],[45.3400,25.5090],[45.3415,25.5120],[45.3428,25.5142]],trailMarking:'RED_CIRCLE',isCircular:false,description_extended:'Iconic rock formation requiring climbing experience'},
  {id:'3',name:'Babele Chapel Historic',description:'Pilgrimage to 18th-century mountain chapel',distance:7.8,elevationGain:420,elevationLoss:420,durationMinutes:200,maxSlope:25.0,avgSlope:11.0,terrain:['forest','path'],difficulty:'EASY',hazards:[],source:'osm',latitude:45.3456,longitude:25.5123,waypoints:[[45.3300,25.5000],[45.3350,25.5050],[45.3390,25.5090],[45.3420,25.5110],[45.3456,25.5123]],trailMarking:'BLUE_CROSS',isCircular:false,description_extended:'Historic chapel carved in rock over 200 years old'},
  {id:'4',name:'Zarnestei Ridge Traverse',description:'Long ridge with alpine meadows and panoramic views',distance:16.5,elevationGain:680,elevationLoss:680,durationMinutes:420,maxSlope:35.0,avgSlope:15.0,terrain:['ridge','meadow','rock'],difficulty:'MEDIUM',hazards:['exposure','weather'],source:'osm',latitude:45.3650,longitude:25.5350,waypoints:[[45.3400,25.5000],[45.3450,25.5050],[45.3500,25.5100],[45.3550,25.5150],[45.3600,25.5250],[45.3650,25.5350]],trailMarking:'RED_WHITE_STRIPES',isCircular:false,description_extended:'Spectacular ridge with 360° Carpathian views'},
  {id:'5',name:'Caraiman Peak Eastern',description:'Route to Caraiman peak with cross monument',distance:9.5,elevationGain:550,elevationLoss:550,durationMinutes:280,maxSlope:38.0,avgSlope:16.0,terrain:['forest','rocky_path'],difficulty:'MEDIUM',hazards:['exposure'],source:'osm',latitude:45.3342,longitude:25.5256,waypoints:[[45.3200,25.5100],[45.3260,25.5150],[45.3310,25.5200],[45.3342,25.5256]],trailMarking:'YELLOW_CIRCLE',isCircular:false,description_extended:'Famous iron cross monument visible from great distances'},
  {id:'6',name:'Plaiul Foii Meadow Loop',description:'Easy walk through high alpine meadows',distance:5.2,elevationGain:120,elevationLoss:120,durationMinutes:120,maxSlope:8.0,avgSlope:3.5,terrain:['meadow','path'],difficulty:'EASY',hazards:[],source:'osm',latitude:45.3300,longitude:25.4950,waypoints:[[45.3250,25.4900],[45.3280,25.4930],[45.3300,25.4950],[45.3320,25.4980],[45.3250,25.4900]],trailMarking:'YELLOW_RECTANGLE',isCircular:true,description_extended:'Perfect for wildflower photography in summer'},
  {id:'7',name:'Bulea Lake Forest Route',description:'Forested descent to pristine mountain lake',distance:6.8,elevationGain:180,elevationLoss:360,durationMinutes:150,maxSlope:18.0,avgSlope:7.5,terrain:['forest','trail'],difficulty:'EASY',hazards:[],source:'osm',latitude:45.3200,longitude:25.4500,waypoints:[[45.3350,25.4700],[45.3320,25.4650],[45.3280,25.4600],[45.3240,25.4550],[45.3200,25.4500]],trailMarking:'YELLOW_CROSS',isCircular:false,description_extended:'Popular family destination with swimming in summer'},
  {id:'8',name:'Costila Peak Northern',description:'Remote peak hike with minimal crowds',distance:12.0,elevationGain:620,elevationLoss:620,durationMinutes:340,maxSlope:40.0,avgSlope:17.0,terrain:['forest','rocky','ridge'],difficulty:'HARD',hazards:['exposure','unmaintained'],source:'osm',latitude:45.3780,longitude:25.5420,waypoints:[[45.3600,25.5300],[45.3650,25.5350],[45.3710,25.5390],[45.3780,25.5420]],trailMarking:'RED_CROSS',isCircular:false,description_extended:'Less crowded peak for adventurous hikers'},
  {id:'9',name:'Diham-Omu Connector',description:'Ridge connector between two major peaks',distance:4.2,elevationGain:280,elevationLoss:180,durationMinutes:140,maxSlope:52.0,avgSlope:28.0,terrain:['rocky','scramble'],difficulty:'HARD',hazards:['exposure','loose_rock'],source:'osm',latitude:45.3520,longitude:25.4980,waypoints:[[45.3450,25.4920],[45.3480,25.4950],[45.3510,25.4970],[45.3540,25.5010]],trailMarking:'RED_CIRCLE',isCircular:false,description_extended:'Exposed scramble not for beginners'},
  {id:'10',name:'Pescara Valley Forest',description:'Gentle forest hike in scenic alpine valley',distance:7.5,elevationGain:250,elevationLoss:250,durationMinutes:180,maxSlope:15.0,avgSlope:6.0,terrain:['forest','valley'],difficulty:'EASY',hazards:[],source:'osm',latitude:45.3150,longitude:25.5050,waypoints:[[45.3300,25.5100],[45.3250,25.5050],[45.3200,25.5010],[45.3150,25.5050],[45.3300,25.5100]],trailMarking:'YELLOW_RECTANGLE',isCircular:true,description_extended:'Peaceful valley hike great for bird watching'},
  {id:'11',name:'Mausolea Piatra Mare',description:'Historic WWI memorial sites hike',distance:8.0,elevationGain:380,elevationLoss:380,durationMinutes:220,maxSlope:30.0,avgSlope:13.0,terrain:['path','rocky'],difficulty:'MEDIUM',hazards:['exposure'],source:'osm',latitude:45.3400,longitude:25.5400,waypoints:[[45.3250,25.5300],[45.3310,25.5350],[45.3370,25.5390],[45.3400,25.5400]],trailMarking:'BLUE_RECTANGLE',isCircular:false,description_extended:'Historic WWI sites with information boards'}
];

interface Trail {
  id: string;
  name: string;
  description: string;
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  durationMinutes: number;
  maxSlope: number;
  avgSlope: number;
  terrain: string[];
  difficulty: string;
  hazards: string[];
  source: string;
  latitude: number;
  longitude: number;
  waypoints?: number[][];
  trailMarking?: string; // e.g., "YELLOW_RECTANGLE", "RED_CIRCLE", "RED_WHITE_STRIPES"
  isCircular?: boolean; // true if trail returns to start point
}

const DIFFICULTY_COLORS: { [key: string]: string } = {
  EASY: '#2ecc71',
  MEDIUM: '#f39c12',
  HARD: '#e74c3c',
  ROCK_CLIMBING: '#8e44ad'
};

const TRAIL_MARKING_COLORS: { [key: string]: { bg: string; text: string; symbol: string } } = {
  'YELLOW_RECTANGLE': { bg: '#FFD700', text: '#000', symbol: '▭' },
  'RED_CIRCLE': { bg: '#FF0000', text: '#FFF', symbol: '●' },
  'BLUE_CROSS': { bg: '#0066CC', text: '#FFF', symbol: '✕' },
  'RED_WHITE_STRIPES': { bg: '#FF0000', text: '#FFF', symbol: '≡' },
  'YELLOW_CIRCLE': { bg: '#FFD700', text: '#000', symbol: '●' },
  'YELLOW_CROSS': { bg: '#FFD700', text: '#000', symbol: '✕' },
  'RED_CROSS': { bg: '#FF0000', text: '#FFF', symbol: '✕' },
  'BLUE_RECTANGLE': { bg: '#0066CC', text: '#FFF', symbol: '▭' }
};

interface WeatherForecast {
  date: string;
  dayName: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
}

// Mock weather data for Bucegi Mountains - next 7 days
const BUCEGI_WEATHER: WeatherForecast[] = (() => {
  const forecasts: WeatherForecast[] = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Windy'];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayIndex = date.getDay();

    forecasts.push({
      date: dateStr,
      dayName: days[dayIndex],
      minTemp: Math.floor(Math.random() * 8) + 5,
      maxTemp: Math.floor(Math.random() * 12) + 12,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipitation: Math.floor(Math.random() * 60),
      windSpeed: Math.floor(Math.random() * 20) + 10
    });
  }
  return forecasts;
})();

export default function App() {
  const [trails, setTrails] = useState<Trail[]>(BUCEGI_TRAILS);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(BUCEGI_TRAILS[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');
  const [mapCenter, setMapCenter] = useState<[number, number]>([45.3500, 25.5000]);
  const [selectedDate, setSelectedDate] = useState<string>(BUCEGI_WEATHER[0].date);
  const [weatherData, setWeatherData] = useState<WeatherForecast[]>(BUCEGI_WEATHER);

  useEffect(() => {
    // Try to fetch from API, fall back to mock data
    const fetchTrails = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/trails');
        if (response.ok) {
          const data = await response.json();
          // Check if API data has the required geographic properties
          if (Array.isArray(data) && data.length > 0 && data[0].latitude && data[0].longitude) {
            // API data has coordinates, use it
            setTrails(data);
            setSelectedTrail(data[0]);
            setError(null);
          } else {
            // API data missing coordinates, use mock data instead
            console.log('API data incomplete, using mock data');
            setTrails(BUCEGI_TRAILS);
            setSelectedTrail(BUCEGI_TRAILS[0]);
          }
        } else {
          setTrails(BUCEGI_TRAILS);
          setSelectedTrail(BUCEGI_TRAILS[0]);
        }
      } catch (err) {
        console.log('Using mock data - API not available:', err);
        setTrails(BUCEGI_TRAILS);
        setSelectedTrail(BUCEGI_TRAILS[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrails();
  }, []);

  const filteredTrails = trails.filter(trail =>
    filterDifficulty === 'ALL' || trail.difficulty === filterDifficulty
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#fff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '15px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexShrink: 0 }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>🥾 TrailEquip – Bucegi Mountains</h1>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Explore 11 hiking trails with interactive maps</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px 20px', fontSize: '12px', flexShrink: 0 }}>
          ⚠️ API Connection Error: {error}
        </div>
      )}

      {/* Main Content - 3 Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: 0, flex: 1, minHeight: 0, overflow: 'hidden', width: '100%' }}>
        {/* Left Sidebar: Trail List */}
        <div style={{ borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#2c3e50' }}>
              Trails ({filteredTrails.length})
            </h2>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">🟢 Easy</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HARD">🔴 Hard</option>
              <option value="ROCK_CLIMBING">🟣 Rock Climbing</option>
            </select>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Loading trails...</p>
            ) : filteredTrails.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No trails match filter</p>
            ) : (
              filteredTrails.map((trail) => (
                <div
                  key={trail.id}
                  onClick={() => {
                    setSelectedTrail(trail);
                    setMapCenter([trail.latitude, trail.longitude]);
                  }}
                  style={{
                    padding: '12px',
                    margin: '5px 0',
                    backgroundColor: selectedTrail?.id === trail.id ? '#fff' : '#fff',
                    border: selectedTrail?.id === trail.id ? `3px solid ${DIFFICULTY_COLORS[trail.difficulty]}` : '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: selectedTrail?.id === trail.id ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as any).style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as any).style.boxShadow = selectedTrail?.id === trail.id ? '0 2px 8px rgba(0,0,0,0.15)' : 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <strong style={{ fontSize: '12px', color: '#2c3e50' }}>{trail.name}</strong>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      backgroundColor: DIFFICULTY_COLORS[trail.difficulty],
                      color: 'white',
                      borderRadius: '3px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {trail.difficulty[0]}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    <span>📏 {trail.distance}km</span>
                    <span>⬆️ {trail.elevationGain}m</span>
                    <span>⏱️ {Math.round(trail.durationMinutes / 60)}h</span>
                    <span>📍 {trail.terrain[0]}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Center: Map */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            key={`map-${selectedTrail?.id}`}
          >
            <MapInvalidator selectedTrail={selectedTrail} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {/* Display all trails on map */}
            {trails.map((trail) => (
              <React.Fragment key={trail.id}>
                {/* Trail marker */}
                <Marker
                  position={[trail.latitude, trail.longitude]}
                  icon={L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="
                      background-color: ${DIFFICULTY_COLORS[trail.difficulty]};
                      border: 3px solid white;
                      border-radius: 50%;
                      width: 24px;
                      height: 24px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      color: white;
                      font-weight: bold;
                      font-size: 12px;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                      cursor: pointer;
                    ">${trail.name[0]}</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                  eventHandlers={{
                    click: () => {
                      setSelectedTrail(trail);
                    }
                  }}
                >
                  <Popup>
                    <div style={{ fontSize: '12px' }}>
                      <strong>{trail.name}</strong><br/>
                      Difficulty: {trail.difficulty}<br/>
                      Distance: {trail.distance}km<br/>
                      <button
                        onClick={() => setSelectedTrail(trail)}
                        style={{
                          marginTop: '5px',
                          padding: '4px 8px',
                          backgroundColor: DIFFICULTY_COLORS[trail.difficulty],
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>

                {/* Highlight selected trail with red polyline and markers */}
                {selectedTrail?.id === trail.id && (
                  <>
                    {/* Draw the full trail path as a red line */}
                    {trail.waypoints && trail.waypoints.length > 0 && (
                      <Polyline
                        positions={trail.waypoints as L.LatLngTuple[]}
                        pathOptions={{
                          color: '#FF0000',
                          weight: 4,
                          opacity: 0.9,
                          lineCap: 'round',
                          lineJoin: 'round'
                        }}
                      />
                    )}

                    {/* Start marker */}
                    <Marker
                      position={trail.waypoints && trail.waypoints.length > 0 ? (trail.waypoints[0] as L.LatLngTuple) : ([trail.latitude, trail.longitude] as L.LatLngTuple)}
                      icon={L.divIcon({
                        className: 'custom-marker-start',
                        html: `<div style="
                          background-color: #00CC00;
                          border: 3px solid white;
                          border-radius: 50%;
                          width: 32px;
                          height: 32px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: white;
                          font-weight: bold;
                          font-size: 16px;
                          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                        ">S</div>`,
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                      })}
                    />

                    {/* End marker */}
                    <Marker
                      position={trail.waypoints && trail.waypoints.length > 0 ? (trail.waypoints[trail.waypoints.length - 1] as L.LatLngTuple) : ([trail.latitude, trail.longitude] as L.LatLngTuple)}
                      icon={L.divIcon({
                        className: 'custom-marker-end',
                        html: `<div style="
                          background-color: #FF0000;
                          border: 3px solid white;
                          border-radius: 50%;
                          width: 32px;
                          height: 32px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: white;
                          font-weight: bold;
                          font-size: 16px;
                          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                          animation: pulse 2s infinite;
                        ">E</div>`,
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                      })}
                    />
                  </>
                )}
              </React.Fragment>
            ))}
          </MapContainer>
        </div>

        {/* Right Sidebar: Weather & Trail Details */}
        <div style={{ borderLeft: '1px solid #ddd', overflowY: 'auto', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Weather Section */}
          <div style={{ padding: '15px', borderBottom: '1px solid #ddd', backgroundColor: '#f0f8ff', flexShrink: 0 }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#01579b', fontWeight: 'bold' }}>
              ☀️ 7-Day Forecast
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#333', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                  Select Date:
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #0066cc',
                    borderRadius: '4px',
                    fontSize: '11px',
                    backgroundColor: '#fff'
                  }}
                >
                  {weatherData.map((w) => (
                    <option key={w.date} value={w.date}>
                      {w.dayName} - {w.date} ({w.minTemp}°-{w.maxTemp}°C)
                    </option>
                  ))}
                </select>
              </div>

              {weatherData.find(w => w.date === selectedDate) && (
                <div style={{ backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '4px', border: '1px solid #90caf9' }}>
                  {(() => {
                    const weather = weatherData.find(w => w.date === selectedDate)!;
                    return (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                          <div>
                            <span style={{ color: '#555', fontWeight: 'bold' }}>🌡️ Temp:</span>
                            <br />
                            <span style={{ color: '#d32f2f', fontSize: '12px', fontWeight: 'bold' }}>
                              {weather.maxTemp}°C
                            </span>
                            <span style={{ color: '#999', fontSize: '10px' }}> high</span>
                            <br />
                            <span style={{ color: '#1976d2', fontSize: '12px', fontWeight: 'bold' }}>
                              {weather.minTemp}°C
                            </span>
                            <span style={{ color: '#999', fontSize: '10px' }}> low</span>
                          </div>
                          <div>
                            <span style={{ color: '#555', fontWeight: 'bold' }}>🌤️ Condition:</span>
                            <br />
                            <span style={{ fontSize: '12px', color: '#333' }}>{weather.condition}</span>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #90caf9' }}>
                          <div>
                            <span style={{ color: '#555', fontWeight: 'bold' }}>💧 Rain:</span>
                            <br />
                            <span style={{ color: '#0288d1', fontWeight: 'bold' }}>{weather.precipitation}%</span>
                          </div>
                          <div>
                            <span style={{ color: '#555', fontWeight: 'bold' }}>💨 Wind:</span>
                            <br />
                            <span style={{ color: '#f57c00', fontWeight: 'bold' }}>{weather.windSpeed} km/h</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Trail Details Section */}
          {selectedTrail ? (
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#2c3e50' }}>{selectedTrail.name}</h3>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  backgroundColor: DIFFICULTY_COLORS[selectedTrail.difficulty],
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {selectedTrail.difficulty}
                </div>
              </div>

              <p style={{ fontSize: '12px', color: '#555', lineHeight: '1.5', marginBottom: '15px' }}>
                {selectedTrail.description}
              </p>

              <div style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '6px', marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#2c3e50' }}>Trail Stats</h4>
                <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '12px', lineHeight: '1.8' }}>
                  <li><strong>Distance:</strong> {selectedTrail.distance} km</li>
                  <li><strong>Elevation Gain:</strong> {selectedTrail.elevationGain} m</li>
                  <li><strong>Elevation Loss:</strong> {selectedTrail.elevationLoss} m</li>
                  <li><strong>Duration:</strong> ~{Math.round(selectedTrail.durationMinutes / 60)}h {selectedTrail.durationMinutes % 60}min</li>
                  <li><strong>Max Slope:</strong> {selectedTrail.maxSlope}%</li>
                  <li><strong>Avg Slope:</strong> {selectedTrail.avgSlope}%</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '6px', marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#2c3e50' }}>Terrain</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedTrail.terrain.map((t) => (
                    <span key={t} style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      backgroundColor: '#e8e8e8',
                      borderRadius: '3px',
                      fontSize: '11px',
                      color: '#333'
                    }}>
                      {t.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {(selectedTrail.trailMarking || selectedTrail.isCircular !== undefined) && (
                <div style={{ backgroundColor: '#e8f4f8', padding: '12px', borderRadius: '6px', marginBottom: '15px', border: '1px solid #b3e5fc' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#01579b' }}>Trail Information</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Trail Marking */}
                    {selectedTrail.trailMarking && TRAIL_MARKING_COLORS[selectedTrail.trailMarking] && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>🎯 Trail Marking:</span>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 12px',
                          backgroundColor: TRAIL_MARKING_COLORS[selectedTrail.trailMarking].bg,
                          color: TRAIL_MARKING_COLORS[selectedTrail.trailMarking].text,
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          minWidth: '40px',
                          textAlign: 'center',
                          border: '2px solid rgba(0,0,0,0.2)'
                        }}>
                          {TRAIL_MARKING_COLORS[selectedTrail.trailMarking].symbol}
                        </span>
                        <span style={{ fontSize: '11px', color: '#555' }}>
                          {selectedTrail.trailMarking.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}

                    {/* Trail Type */}
                    {selectedTrail.isCircular !== undefined && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>
                          {selectedTrail.isCircular ? '🔄 Route Type:' : '➜ Route Type:'}
                        </span>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          backgroundColor: selectedTrail.isCircular ? '#c8e6c9' : '#fff9c4',
                          color: selectedTrail.isCircular ? '#1b5e20' : '#f57f17',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}>
                          {selectedTrail.isCircular ? 'Circular Loop' : 'Point-to-Point'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedTrail.hazards && selectedTrail.hazards.length > 0 && (
                <div style={{ backgroundColor: '#fff3cd', padding: '12px', borderRadius: '6px', border: '1px solid #ffeaa7' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#856404' }}>⚠️ Hazards</h4>
                  <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '12px', lineHeight: '1.8', color: '#856404' }}>
                    {selectedTrail.hazards.map((h) => (
                      <li key={h}>{h.replace(/_/g, ' ')}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              <p>Select a trail to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px 20px', borderTop: '1px solid #ddd', fontSize: '11px', color: '#666', flexShrink: 0 }}>
        <span>✅ 11 Bucegi Mountains trails with GPS routes</span> {' | '}
        <a href="/api/v1/health" target="_blank" rel="noreferrer" style={{ marginLeft: '10px', color: '#0366d6' }}>API Health</a> {' | '}
        <a href="/swagger-ui.html" target="_blank" rel="noreferrer" style={{ marginLeft: '10px', color: '#0366d6' }}>API Docs</a>
      </div>
    </div>
  );
}
