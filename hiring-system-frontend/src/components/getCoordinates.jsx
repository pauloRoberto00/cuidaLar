import axios from 'axios';

const getCoordinates = async (city) => {
  const apiKey = '1275cb9675b84eb899062593cae67e3c';
  // const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}&limit=1`;
  const url = `https://api.geoapify.com/v1/geocode/search?text=${city}&format=json&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.results.length > 0) {
      const { lat, lon } = response.data.results[0];
      return { lat, lon };
    } else {
      throw new Error('City not found');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error.message);
    return null;
  }
};

export default getCoordinates;