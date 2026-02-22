import api from './api';

export const getRateCard = async () => {
    const response = await api.get('/ratecard/me');
    return response.data;
};

export const createRateCard = async (data) => {
    const response = await api.post('/ratecard/me', data);
    return response.data;
};

export const updateRateCard = async (data) => {
    const response = await api.put('/ratecard/me', data);
    return response.data;
};