import api from "@/lib/axios";

import type { Idea } from "@/types";

export const fetchIdeas = async (): Promise<Idea[]> => {
  const res = await api.get(`/ideas`);
  return res.data;
}

export const fetchIdea = async (id: string): Promise<Idea> => {
  const res = await api.get(`/ideas/${id}`);
  return res.data;
}
