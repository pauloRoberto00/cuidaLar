import axios from 'axios';

const getNearbyCities = async (lat, lng) => {
  // const url = `https//api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lon}&radius=${radius}&maxRows=${maxRows}&username=${username}`;
  const url = `https://geonames-proxy.onrender.com/geonames/findNearby?lat=${lat}&lng=${lng}`;

  try {
    const response = await axios.get(url, {
      params: {
        lat: lat,
        lng: lng,
        username: 'hasuki_',
        radius: 150,
        maxRows: 300,
      }
    });
    return response.data.geonames ? response.data.geonames.map(city => city.name) : [];
  } catch (error) {
    console.error('Error fetching nearby cities:', error.message);
    return [];
  }
};

export default getNearbyCities;