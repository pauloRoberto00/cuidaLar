import axios from 'axios';

const searchNearbyCities = async (lat, lng) => {
  // const url = `https//api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lon}&radius=${radius}&maxRows=${maxRows}&username=${username}`;
  const apiUrl = import.meta.env.VITE_API_URL;
  const url = `${apiUrl}/searchNearbyCities`;

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
    return response.data.geonames ? response.data.geonames.map(city => city.name) : [];
  } catch (error) {
    console.error('Error fetching nearby cities:', error);
    return [];
  }
};

export default searchNearbyCities;