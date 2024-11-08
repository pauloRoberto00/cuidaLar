import axios from 'axios';

const searchNearbyPlaces = async (lat, lng) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const url = `${apiUrl}/searchNearbyPlaces`;

  try {
    const response = await axios.get(url, {
      params: {
        lat: lat,
        lng: lng,
        username: 'hasuki_',
        radius: 300,
        maxRows: 300,
      }
    });
    return response.data.geonames ? response.data.geonames.map(place => place.name) : [];
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};

export default searchNearbyPlaces;