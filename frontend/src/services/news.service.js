import { apiService } from './api';

export const newsService = {
  getNews: (category = 'all', region = 'all') => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (region && region !== 'all') params.append('region', region);
    const q = params.toString();
    return apiService.get(`/news${q ? `?${q}` : ''}`);
  },
};
