import { useInfiniteQuery } from '@tanstack/react-query';

const PER_PAGE = 21;
const BASE_URL = 'https://pixabay.com/api/';

async function fetchImages({ query, category, order, pageParam = 1 }) {
  if (!query) return { hits: [], totalHits: 0 };
  const params = [
    `key=${import.meta.env.VITE_PIXABAY_API_KEY}`,
    `q=${encodeURIComponent(query)}`,
    'image_type=photo',
    'safesearch=true',
    `order=${order}`,
    category ? `category=${category}` : '',
    `per_page=${PER_PAGE}`,
    `page=${pageParam}`
  ].filter(Boolean).join('&');

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch images');
  const data = await res.json();
  return { hits: data.hits || [], totalHits: data.totalHits || 0, page: pageParam };
}

export default function usePixabayInfinite({ query, category, order }) {
  return useInfiniteQuery({
    queryKey: ['pixabay', query, category, order],
    queryFn: ({ pageParam = 1 }) => fetchImages({ query, category, order, pageParam }),
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.flatMap(p => p.hits).length;
      return loaded < lastPage.totalHits ? pages.length + 1 : undefined;
    },
    enabled: Boolean(query),
    keepPreviousData: false,
    // keep data fresh indefinitely
    staleTime: Infinity
  });
}
