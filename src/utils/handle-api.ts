export interface NewsData {
  title: string;
  summary: string | null;
  image: string | null;
  published: string;
  link: string;
  id: string;
}

export async function fetchNews(): Promise<NewsData[]> {
  try {
    const response = await fetch('https://api.first.org/data/v1/news');
    const json = await response.json();
    const rawItems = Object.values(json.data) as any[];
    return rawItems.map((item, index) => ({
      id: String(index),
      title: item.title ?? 'Sem título',
      summary: item.summary ?? null,
      image: item.image ?? null,
      published: item.published ?? '',
      link: item.link ?? '',
    }));
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
}
