import api from './api';

export const getSettings = async () => {
    const response = await api.get('/settings/me');
    return response.data;
};

export const updateSettings = async (data) => {
    const response = await api.put('/settings/me', data);
    return response.data;
};

export const uploadLogo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/settings/me/logo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const uploadSignature = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/settings/me/signature', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};