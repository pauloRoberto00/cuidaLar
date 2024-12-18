import axios from 'axios';
import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
  const { lat, lng, radius, maxRows, username } = req.query;
  const url = `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&radius=${radius}&maxRows=${maxRows}&username=${username}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados do GeoNames' });
  }
});

export default router;