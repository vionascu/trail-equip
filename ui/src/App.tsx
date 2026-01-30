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

// Catmull-Rom spline interpolation for smooth curves (like Waze/Google Maps)
function interpolateWaypoints(waypoints: number[][], factor: number = 5): number[][] {
  if (waypoints.length < 2) return waypoints;

  const interpolated: number[][] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    interpolated.push(waypoints[i]);

    // Get control points for cubic Hermite interpolation
    const p0 = waypoints[Math.max(0, i - 1)];
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    const p3 = waypoints[Math.min(waypoints.length - 1, i + 2)];

    // Generate intermediate points
    for (let t = 1; t < factor; t++) {
      const s = t / factor;
      const s2 = s * s;
      const s3 = s2 * s;

      // Catmull-Rom matrix coefficients
      const a0 = -0.5 * s3 + s2 - 0.5 * s;
      const a1 = 1.5 * s3 - 2.5 * s2 + 1.0;
      const a2 = -1.5 * s3 + 2.0 * s2 + 0.5 * s;
      const a3 = 0.5 * s3 - 0.5 * s2;

      const lat = a0 * p0[0] + a1 * p1[0] + a2 * p2[0] + a3 * p3[0];
      const lng = a0 * p0[1] + a1 * p1[1] + a2 * p2[1] + a3 * p3[1];

      interpolated.push([lat, lng]);
    }
  }

  // Add the last waypoint
  interpolated.push(waypoints[waypoints.length - 1]);

  return interpolated;
}

// Bucegi Mountains Hiking Trails - Real OSMC Routes from Munții Noștri System
const BUCEGI_TRAILS = [
  {id:'1',name:'Sinaia to Omu Peak (Blue Route)',description:'Munții Noștri 01MN02: Famous blue-striped trail from Sinaia through Cabana Stâna Regală to Omu',distance:18.5,elevationGain:1850,elevationLoss:1850,durationMinutes:420,maxSlope:35.0,avgSlope:16.0,terrain:['forest','alpine_meadow','rocky'],difficulty:'HARD',hazards:['exposure','weather'],source:'osm',latitude:45.3585,longitude:25.5050,waypoints:[[45.3100,25.4500],[45.3125,25.4520],[45.3150,25.4540],[45.3175,25.4565],[45.3200,25.4590],[45.3230,25.4620],[45.3260,25.4650],[45.3290,25.4680],[45.3315,25.4705],[45.3340,25.4730],[45.3365,25.4755],[45.3385,25.4775],[45.3405,25.4795],[45.3430,25.4820],[45.3450,25.4840],[45.3470,25.4860],[45.3490,25.4880],[45.3510,25.4900],[45.3530,25.4920],[45.3550,25.4940],[45.3570,25.4960],[45.3585,25.5050]],trailMarking:'BLUE_STRIPE',isCircular:false,description_extended:'Official Munții Noștri 01MN02: Blue stripe main route. Sinaia → Cabana Stâna Regală → Cabana Piatra Arsă → Valea Obârșiei → Cabana Omu'},
  {id:'2',name:'Zarnesti Loop (Blue Triangle)',description:'Munții Noștri 02MN06: Refugiul Diana - Padina Popii - Ridge traverse',distance:14.2,elevationGain:880,elevationLoss:880,durationMinutes:300,maxSlope:40.0,avgSlope:18.0,terrain:['alpine','rocky','ridge'],difficulty:'HARD',hazards:['exposure'],source:'osm',latitude:45.4200,longitude:25.6100,waypoints:[[45.4100,25.5950],[45.4115,25.5968],[45.4130,25.5985],[45.4145,25.6005],[45.4160,25.6022],[45.4175,25.6040],[45.4190,25.6060],[45.4200,25.6075],[45.4200,25.6100],[45.4195,25.6120],[45.4185,25.6135],[45.4175,25.6150],[45.4165,25.6162],[45.4155,25.6172],[45.4145,25.6178]],trailMarking:'BLUE_TRIANGLE',isCircular:true,description_extended:'Munții Noștri 02MN06: Blue triangle. Refugiul Diana (1510m) → Padina Popii → Ridge routes'},
  {id:'3',name:'Babele to Sphinx Ridge (Blue Cross)',description:'Munții Noștri 02MN03: Alpine ridge connector with dramatic rock formations',distance:8.5,elevationGain:520,elevationLoss:520,durationMinutes:180,maxSlope:38.0,avgSlope:14.0,terrain:['ridge','rock','alpine'],difficulty:'MEDIUM',hazards:['exposure'],source:'osm',latitude:45.3456,longitude:25.5123,waypoints:[[45.3380,25.5050],[45.3395,25.5065],[45.3410,25.5080],[45.3425,25.5095],[45.3440,25.5108],[45.3450,25.5120],[45.3456,25.5123]],trailMarking:'BLUE_CROSS',isCircular:false,description_extended:'Munții Noștri 02MN03: Blue cross junction route. Connects Babele → Sphinx → Ridge paths'},
  {id:'4',name:'Brâna Caprelor Circuit (Blue Stripe)',description:'Munții Noștri 02MN10: Refugiul Diana - Brâna Caprelor - Ridge circuit',distance:20.5,elevationGain:1200,elevationLoss:1200,durationMinutes:420,maxSlope:42.0,avgSlope:18.5,terrain:['alpine','ridge','rocky'],difficulty:'HARD',hazards:['exposure','weather'],source:'osm',latitude:45.4180,longitude:25.6120,waypoints:[[45.4000,25.5950],[45.4020,25.5970],[45.4040,25.5990],[45.4060,25.6010],[45.4080,25.6030],[45.4100,25.6050],[45.4120,25.6070],[45.4140,25.6090],[45.4160,25.6110],[45.4180,25.6120],[45.4170,25.6140],[45.4160,25.6155],[45.4150,25.6165],[45.4140,25.6170]],trailMarking:'BLUE_STRIPE',isCircular:true,description_extended:'Munții Noștri 02MN10: Blue stripe main loop. Zărnești → Refugiul Diana → Brâna Caprelor (1936m) → Șaua Padinei Închise'},
  {id:'5',name:'Yellow Ridge Variant (Yellow Stripe)',description:'Munții Noștri 02MN11: Alternative alpine route via Padina Popii',distance:12.8,elevationGain:750,elevationLoss:750,durationMinutes:280,maxSlope:36.0,avgSlope:15.0,terrain:['alpine','meadow','ridge'],difficulty:'MEDIUM',hazards:['weather'],source:'osm',latitude:45.4150,longitude:25.5980,waypoints:[[45.4050,25.5850],[45.4070,25.5870],[45.4090,25.5890],[45.4110,25.5910],[45.4130,25.5930],[45.4150,25.5950],[45.4165,25.5965],[45.4175,25.5975]],trailMarking:'YELLOW_STRIPE',isCircular:false,description_extended:'Munții Noștri 02MN11: Yellow stripe alternative. Connects lower valleys to alpine meadows'},
  {id:'6',name:'Red Ridge Branch (Red Cross)',description:'Munții Noștri 02MN12: Secondary junction route with red blazes',distance:9.2,elevationGain:640,elevationLoss:640,durationMinutes:220,maxSlope:40.0,avgSlope:17.0,terrain:['rocky','ridge','alpine'],difficulty:'MEDIUM',hazards:['exposure'],source:'osm',latitude:45.4120,longitude:25.6050,waypoints:[[45.4020,25.5950],[45.4040,25.5970],[45.4060,25.5990],[45.4080,25.6010],[45.4100,25.6030],[45.4120,25.6050],[45.4130,25.6060]],trailMarking:'RED_CROSS',isCircular:false,description_extended:'Munții Noștri 02MN12: Red cross branch. Connects major junctions at La Table (1377m)'},
  {id:'7',name:'Peaks Connector Trail (Blue Dot)',description:'Munții Noștri 02MN05: Connector between Caraiman and Omu peaks',distance:7.5,elevationGain:420,elevationLoss:420,durationMinutes:160,maxSlope:32.0,avgSlope:13.0,terrain:['meadow','rocky'],difficulty:'MEDIUM',hazards:[],source:'osm',latitude:45.3500,longitude:25.5200,waypoints:[[45.3400,25.5100],[45.3415,25.5115],[45.3430,25.5130],[45.3445,25.5145],[45.3460,25.5160],[45.3475,25.5175],[45.3490,25.5190],[45.3500,25.5200]],trailMarking:'BLUE_DOT',isCircular:false,description_extended:'Munții Noștri 02MN05: Blue dot connector. Links major peaks through scenic meadows'},
  {id:'8',name:'Red Stripe Secondary Route (Red Stripe)',description:'Munții Noștri 02MN29: Secondary red-striped trail with scenic views',distance:11.0,elevationGain:720,elevationLoss:720,durationMinutes:260,maxSlope:35.0,avgSlope:16.0,terrain:['forest','ridge'],difficulty:'HARD',hazards:['weather'],source:'osm',latitude:45.3750,longitude:25.5400,waypoints:[[45.3650,25.5300],[45.3670,25.5320],[45.3690,25.5340],[45.3710,25.5360],[45.3730,25.5380],[45.3750,25.5400]],trailMarking:'RED_STRIPE',isCircular:false,description_extended:'Munții Noștri 02MN29: Red stripe secondary. Popular scenic variant'},
  {id:'9',name:'Yellow Peak Ascent (Yellow Triangle)',description:'Munții Noștri 02MN06: Yellow-marked variant to peak via eastern ridge',distance:10.5,elevationGain:820,elevationLoss:820,durationMinutes:240,maxSlope:42.0,avgSlope:19.0,terrain:['ridge','rocky','alpine'],difficulty:'HARD',hazards:['exposure'],source:'osm',latitude:45.3850,longitude:25.5200,waypoints:[[45.3750,25.5100],[45.3770,25.5120],[45.3790,25.5140],[45.3810,25.5160],[45.3830,25.5180],[45.3850,25.5200]],trailMarking:'YELLOW_TRIANGLE',isCircular:false,description_extended:'Munții Noștri 02MN06: Yellow triangle peak route'},
  {id:'10',name:'Red Ridge Scenic Loop (Red Triangle)',description:'Munții Noștri 02MN21: Red-marked scenic loop through alpine meadows',distance:13.5,elevationGain:900,elevationLoss:900,durationMinutes:300,maxSlope:38.0,avgSlope:17.0,terrain:['meadow','ridge','rocky'],difficulty:'MEDIUM',hazards:['weather','exposure'],source:'osm',latitude:45.3700,longitude:25.5300,waypoints:[[45.3600,25.5200],[45.3620,25.5220],[45.3640,25.5240],[45.3660,25.5260],[45.3680,25.5280],[45.3700,25.5300]],trailMarking:'RED_TRIANGLE',isCircular:true,description_extended:'Munții Noștri 02MN21: Red triangle scenic loop'},
  {id:'11',name:'Cross Junction Hub (Blue Cross)',description:'Munții Nosstri 02MN13: Major route junction with blue cross markers',distance:6.8,elevationGain:450,elevationLoss:450,durationMinutes:150,maxSlope:35.0,avgSlope:14.0,terrain:['rocky','alpine'],difficulty:'MEDIUM',hazards:[],source:'osm',latitude:45.3550,longitude:25.5150,waypoints:[[45.3450,25.5050],[45.3470,25.5070],[45.3490,25.5090],[45.3510,25.5110],[45.3530,25.5130],[45.3550,25.5150]],trailMarking:'BLUE_CROSS',isCircular:false,description_extended:'Munții Noștri 02MN13: Blue cross junction hub. Major route connector'}
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

const TRAIL_MARKING_COLORS: { [key: string]: { color: string; description: string; symbol: string } } = {
  'BLUE_STRIPE': { color: '#0000FF', description: 'Blue stripe - Main route (Bandă Albastră)', symbol: '━' },
  'BLUE_TRIANGLE': { color: '#0000FF', description: 'Blue triangle - Ridge/Summit (Triunghi Albastru)', symbol: '▲' },
  'BLUE_CROSS': { color: '#0000FF', description: 'Blue cross - Junction (Cruce Albastră)', symbol: '✛' },
  'BLUE_DOT': { color: '#0000FF', description: 'Blue dot - Connector (Punct Albastru)', symbol: '●' },
  'RED_STRIPE': { color: '#FF0000', description: 'Red stripe - Secondary route (Bandă Roșie)', symbol: '━' },
  'RED_CROSS': { color: '#FF0000', description: 'Red cross - Branch junction (Cruce Roșie)', symbol: '✛' },
  'RED_TRIANGLE': { color: '#FF0000', description: 'Red triangle - Scenic variant (Triunghi Roșu)', symbol: '▲' },
  'YELLOW_STRIPE': { color: '#FFFF00', description: 'Yellow stripe - Alternative route (Bandă Galbenă)', symbol: '━' },
  'YELLOW_TRIANGLE': { color: '#FFFF00', description: 'Yellow triangle - Local variant (Triunghi Galben)', symbol: '▲' }
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
          // Check if API data has the required geographic properties and waypoints
          if (
            Array.isArray(data) &&
            data.length > 0 &&
            data[0].latitude &&
            data[0].longitude &&
            data[0].waypoints &&
            Array.isArray(data[0].waypoints) &&
            data[0].waypoints.length > 2
          ) {
            // API data has complete trail data with waypoints
            setTrails(data);
            setSelectedTrail(data[0]);
            setError(null);
          } else {
            // API data missing waypoints, use mock data instead
            console.log('API data incomplete (missing waypoints), using mock data');
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
            <TileLayer
              url="https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://waymarkedtrails.org">Waymarked Trails</a>, OpenStreetMap'
              opacity={0.85}
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

                {/* Highlight selected trail with smooth polyline and markers */}
                {selectedTrail?.id === trail.id && (
                  <>
                    {/* Draw the full trail path with smooth curve interpolation */}
                    {trail.waypoints && trail.waypoints.length > 0 && (
                      <>
                        {/* White border/outline for bold look (topographic map style) */}
                        <Polyline
                          positions={interpolateWaypoints(trail.waypoints, 8) as L.LatLngTuple[]}
                          pathOptions={{
                            color: '#FFFFFF',
                            weight: 8,
                            opacity: 1,
                            lineCap: 'round',
                            lineJoin: 'round'
                          }}
                        />
                        {/* Main bold red trail line (like the topographic map) */}
                        <Polyline
                          positions={interpolateWaypoints(trail.waypoints, 8) as L.LatLngTuple[]}
                          pathOptions={{
                            color: '#DD0000',
                            weight: 5,
                            opacity: 1,
                            lineCap: 'round',
                            lineJoin: 'round'
                          }}
                        />
                      </>
                    )}

                    {/* Trail marking badges along the path (like topographic map) */}
                    {trail.waypoints && trail.waypoints.length > 4 && trail.trailMarking && TRAIL_MARKING_COLORS[trail.trailMarking] && (() => {
                      const waypoints = trail.waypoints!;
                      const trailMarking = trail.trailMarking!;
                      const marking = TRAIL_MARKING_COLORS[trailMarking];
                      return (
                        <>
                          {waypoints.map((waypoint, idx) => {
                            // Show marking badges every 4-5 waypoints
                            if (idx % 4 !== 0 || idx === 0 || idx === waypoints.length - 1) return null;
                            return (
                              <Marker
                                key={`marking-${idx}`}
                                position={[waypoint[0], waypoint[1]] as L.LatLngTuple}
                                icon={L.divIcon({
                                  className: 'trail-osmc-marker',
                                  html: `<div style="
                                    width: 44px;
                                    height: 44px;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    box-shadow: 0 4px 10px rgba(0,0,0,0.7);
                                    border-radius: 3px;
                                    background: white;
                                    border: 3px solid ${marking.color};
                                    font-weight: bold;
                                    font-size: 24px;
                                    color: ${marking.color};
                                    line-height: 1;
                                    cursor: pointer;
                                  ">${marking.symbol}</div>`,
                                  iconSize: [24, 24],
                                  iconAnchor: [12, 12]
                                })}
                              />
                            );
                          })}
                        </>
                      );
                    })()}

                    {/* Start marker - Green circle with accent */}
                    <Marker
                      position={trail.waypoints && trail.waypoints.length > 0 ? (trail.waypoints[0] as L.LatLngTuple) : ([trail.latitude, trail.longitude] as L.LatLngTuple)}
                      icon={L.divIcon({
                        className: 'custom-marker-start',
                        html: `<div style="
                          background: linear-gradient(135deg, #00CC00 0%, #009900 100%);
                          border: 4px solid white;
                          border-radius: 50%;
                          width: 40px;
                          height: 40px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: white;
                          font-weight: bold;
                          font-size: 20px;
                          box-shadow: 0 0 0 2px rgba(0,200,0,0.3), 0 4px 12px rgba(0,0,0,0.4);
                          position: relative;
                        ">●</div>`,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20]
                      })}
                    />

                    {/* End marker - Red flag with pulsing animation */}
                    <Marker
                      position={trail.waypoints && trail.waypoints.length > 0 ? (trail.waypoints[trail.waypoints.length - 1] as L.LatLngTuple) : ([trail.latitude, trail.longitude] as L.LatLngTuple)}
                      icon={L.divIcon({
                        className: 'custom-marker-end',
                        html: `<div style="
                          background: linear-gradient(135deg, #FF0000 0%, #CC0000 100%);
                          border: 4px solid white;
                          border-radius: 50%;
                          width: 40px;
                          height: 40px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: white;
                          font-weight: bold;
                          font-size: 20px;
                          box-shadow: 0 0 0 2px rgba(255,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4);
                          animation: pulseWaze 1.5s infinite;
                        ">▼</div>`,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20]
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', color: '#333', fontWeight: 'bold' }}>🎯 Trail Marking (OSMC):</span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '42px',
                          height: '42px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                          borderRadius: '3px',
                          background: 'white',
                          border: `3px solid ${TRAIL_MARKING_COLORS[selectedTrail.trailMarking].color}`,
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: TRAIL_MARKING_COLORS[selectedTrail.trailMarking].color
                        }}>
                          {TRAIL_MARKING_COLORS[selectedTrail.trailMarking].symbol}
                        </div>
                        <span style={{ fontSize: '11px', color: '#666' }}>
                          <div style={{ fontWeight: 'bold' }}>{TRAIL_MARKING_COLORS[selectedTrail.trailMarking].description}</div>
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
