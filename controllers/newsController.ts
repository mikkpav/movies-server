import type { Request, Response } from 'express';
import { fetchTopHeadlines, fetchSearchResults } from '../services/gnewsService.js';

export async function getTopHeadlines(req: Request, res: Response) {
  const { country } = req.query;
  const data = await fetchTopHeadlines(country as string);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(data);
}

export async function getSearchResults(req: Request, res: Response) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Missing query parameter 'q'" });
  }

  const data = await fetchSearchResults(q as string);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(data);
}
