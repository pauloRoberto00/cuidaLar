import axios from "axios";

const formatCEP = (value) => {
    const onlyNumbers = value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < onlyNumbers.length; i++) {
        if (i === 5) formatted += '-';
        formatted += onlyNumbers[i];
    }
    return formatted;
};

const isValidCEP = async (cep) => {
    const response = await axios.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
    if(response.data.erro) return false;
    return true;
};

export { formatCEP, isValidCEP };