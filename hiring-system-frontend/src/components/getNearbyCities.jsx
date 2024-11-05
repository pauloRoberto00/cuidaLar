import axios from 'axios';

const getNearbyCities = async (lat, lon) => {
  const username = 'hasuki_'
  const radius = 150;
  const maxRows = 300;
  const url = `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lon}&radius=${radius}&maxRows=${maxRows}&username=${username}`;

  try {
    const response = await axios.get(url);
    return response.data.geonames.map(city => city.name);
  } catch (error) {
    console.error('Error fetching nearby cities:', error.message);
    return [];
  }
};

export default getNearbyCities;