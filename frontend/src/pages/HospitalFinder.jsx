import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete } from '@react-google-maps/api';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '1rem'
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

const mapOptions = {
  zoom: 12,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true
};

const libraries = ['places'];

export default function HospitalFinder() {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [searchRadius, setSearchRadius] = useState(5000);
  const [filterSpec, setFilterSpec] = useState('');
  const [mapRef, setMapRef] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoadAutocomplete = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        setUserLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    }
  };

  const handleSearchKeyPress = async (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value;
      if (!query) return;
      try {
        setLoading(true);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setUserLocation({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          });
          setError('');
        } else {
          setError('Location not found. Please try another search term.');
        }
      } catch (err) {
        setError('Search failed to process.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (err) => {
          setError('Failed to get current location. Please allow browser location access.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  // Get user location
  useEffect(() => {
    // Disable geolocation so it uses the default New Delhi center where our mock data is located.
    /*
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.log('Location access denied, using default');
        }
      );
    }
    */
  }, []);

  // Fetch nearby hospitals
  const fetchNearbyHospitals = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.getNearbyHospitals(
        userLocation.lat,
        userLocation.lng,
        searchRadius
      );

      if (response.data.success) {
        setHospitals(response.data.data.hospitals);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  }, [userLocation, searchRadius]);

  // Fetch recommendations (if from symptom analysis)
  const fetchRecommendations = useCallback(async (analysisId) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.getHospitalRecommendations(
        analysisId,
        userLocation.lat,
        userLocation.lng
      );

      if (response.data.success) {
        setHospitals(response.data.data.hospitals);
        setDoctors(response.data.data.doctors);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  // Auto-fetch on component mount
  useEffect(() => {
    fetchNearbyHospitals();
  }, [userLocation]);

  // Filter hospitals by specialization
  const filteredHospitals = filterSpec
    ? hospitals.filter(h => h.specializations?.includes(filterSpec))
    : hospitals;

  const allSpecializations = [...new Set(hospitals.flatMap(h => h.specializations || []))];

  const handleMapLoad = (mapInstance) => {
    setMapRef(mapInstance);
  };

  const handleRefresh = () => {
    fetchNearbyHospitals();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl p-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <span>🏥</span> Find Hospitals & Doctors
          </h1>
          <p className="text-emerald-100 mb-4">Search for nearby healthcare providers and view details</p>
          
          {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
            <div className="mt-4 pt-4 border-t border-emerald-400 text-sm">
              <span className="inline-block bg-emerald-500 px-3 py-1 rounded-full">💡 Tip:</span>
              <span className="ml-2">All hospitals are listed below! To enable the interactive map, add a Google Maps API key to <code className="bg-emerald-700 px-2 py-1 rounded">frontend/.env</code></span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Controls and List */}
          <div className="lg:col-span-1">
            {/* Search Controls */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Filters</h2>

              {/* Search Radius */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius: {(searchRadius / 1000).toFixed(1)} km
                </label>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Specialization Filter */}
              <div className="mb-6">
                <label htmlFor="spec" className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <select
                  id="spec"
                  value={filterSpec}
                  onChange={(e) => setFilterSpec(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Specializations</option>
                  {allSpecializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  🔄 Refresh
                </button>
                <button
                  onClick={handleCurrentLocation}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  📍 Current Location
                </button>
              </div>
            </div>

            {/* Hospitals List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="font-semibold text-gray-900">
                  Hospitals Found: {filteredHospitals.length}
                </h2>
              </div>

              <div className="divide-y max-h-[600px] overflow-y-auto">
                {loading && (
                  <div className="p-8 flex justify-center">
                    <Spinner size="md" />
                  </div>
                )}

                {!loading && filteredHospitals.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No hospitals found in this area
                  </div>
                )}

                {!loading && filteredHospitals.map((hospital) => (
                  <div
                    key={hospital.hospitalId}
                    onClick={() => setSelectedHospital(hospital)}
                    className="p-4 hover:bg-blue-50 cursor-pointer transition border-l-4 border-transparent hover:border-blue-600"
                  >
                    <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{hospital.address}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-medium ml-1">{hospital.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({hospital.reviewCount})</span>
                      </div>
                    </div>

                    {hospital.specializations && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hospital.specializations.slice(0, 2).map(spec => (
                          <span key={spec} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {spec}
                          </span>
                        ))}
                        {hospital.specializations.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            +{hospital.specializations.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {hospital.emergencyServices && (
                      <p className="text-xs text-red-600 font-semibold mt-2">🚨 Emergency Services</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="lg:col-span-2">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span>🗺️</span> Hospital Locations
                </h2>
                {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                    Map Unavailable
                  </span>
                )}
              </div>
              
              {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
                  <div className="mb-4 relative z-10 w-full max-w-md">
                    <Autocomplete
                      onLoad={onLoadAutocomplete}
                      onPlaceChanged={onPlaceChanged}
                    >
                      <input
                        type="text"
                        onKeyDown={handleSearchKeyPress}
                        placeholder="Search for an area to find hospitals (Press Enter)..."
                        className="w-full px-4 py-2 border border-blue-200 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
                        style={{ boxSizing: `border-box` }}
                      />
                    </Autocomplete>
                  </div>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={userLocation}
                    zoom={mapOptions.zoom}
                    options={mapOptions}
                    onLoad={handleMapLoad}
                  >
                    {/* User Location Marker */}
                    <Marker
                      position={userLocation}
                      title="Your Location"
                      icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    />

                    {/* Hospital Markers */}
                    {filteredHospitals.map((hospital) => (
                      <Marker
                        key={hospital.hospitalId}
                        position={{
                          lat: hospital.location?.lat || defaultCenter.lat,
                          lng: hospital.location?.lng || defaultCenter.lng
                        }}
                        title={hospital.name}
                        onClick={() => setSelectedHospital(hospital)}
                      />
                    ))}

                    {/* Info Window */}
                    {selectedHospital && (
                      <InfoWindow
                        position={{
                          lat: selectedHospital.location?.lat || defaultCenter.lat,
                          lng: selectedHospital.location?.lng || defaultCenter.lng
                        }}
                        onCloseClick={() => setSelectedHospital(null)}
                      >
                        <div className="max-w-xs">
                          <h3 className="font-semibold text-gray-900 mb-1">{selectedHospital.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{selectedHospital.address}</p>
                          
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm font-medium ml-1">{selectedHospital.rating}</span>
                          </div>

                          {selectedHospital.phone && (
                            <p className="text-sm text-gray-600 mb-2">📞 {selectedHospital.phone}</p>
                          )}

                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1 px-3 rounded transition">
                            View Details
                          </button>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </LoadScript>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-8 h-96 flex items-center justify-center border-2 border-blue-200">
                  <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Map Not Available</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      To see hospitals on an interactive map, you need to add a <strong>Google Maps API key</strong>.
                    </p>
                    
                    <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200 text-left">
                      <p className="text-sm font-semibold text-gray-900 mb-3">📋 How to get your API key:</p>
                      <ol className="text-xs text-gray-700 space-y-2">
                        <li>1. Visit <span className="font-mono bg-gray-100 px-1">console.cloud.google.com</span></li>
                        <li>2. Create a new project or select existing</li>
                        <li>3. Enable "Maps JavaScript API"</li>
                        <li>4. Create an API key in Credentials</li>
                        <li>5. Add to <span className="font-mono bg-gray-100 px-1">frontend/.env</span></li>
                      </ol>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-900 font-semibold mb-2">✅ Good news!</p>
                      <p className="text-xs text-green-800">
                        All hospitals are listed in the sidebar. You can still search, filter, and see complete hospital details below!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Associated Doctors */}
            {doctors.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Doctors</h2>

                <div className="grid grid-cols-1 gap-4">
                  {doctors.map((doctor) => (
                    <div key={doctor.doctorId} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm font-medium ml-1">{doctor.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">({doctor.reviewCount} reviews)</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mb-3">
                        🏥 {doctor.hospital}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          {doctor.available && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              ✓ Available Now
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">₹{doctor.consultationFee}</p>
                          <p className="text-xs text-gray-500">consultation</p>
                        </div>
                      </div>

                      <button className="w-full mt-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-3 rounded transition text-sm">
                        Book Appointment
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
