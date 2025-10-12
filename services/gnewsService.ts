import axios from 'axios';

const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

export async function fetchTopHeadlines(country = 'us') {
  const response = await axios.get(`${GNEWS_BASE_URL}/top-headlines`, {
    params: {
      apikey: process.env.GNEWS_API_KEY,
      country,
    },
  });
  return response.data;
}

export async function fetchSearchResults(q: string) {
  const response = await axios.get(`${GNEWS_BASE_URL}/search`, {
    params: {
      apikey: process.env.GNEWS_API_KEY,
      q,
    },
  });
  return response.data;
}
