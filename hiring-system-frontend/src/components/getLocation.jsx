import axios from 'axios';

const getStates = async () => {
    try {
        const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const sortedStates = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
        return sortedStates;
    } catch (error) {
        console.error('Error fetching states:', error.message);
        return [];
    }
};

const getCities = async (state) => {
    try {
        const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`);
        const sortedCities = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
        return sortedCities;
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
};

export { getStates, getCities };