import { useState, useEffect } from 'react';

const BASE_URL = 'https://pixabay.com/api/';

export default function useFetchImage({
    query,
    order = 'popular',
    category = '',
    perPage = 20,
    page = 1
}) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query) {
            setImages([]);
            return;
        }
        setLoading(true);
        setError(null);
        const params = [
            `key=${import.meta.env.VITE_PIXABAY_API_KEY}`,
            `q=${encodeURIComponent(query)}`,
            'image_type=photo',
            'safesearch=true',
            `order=${order}`,
            category ? `category=${category}` : '',
            `per_page=${perPage}`,
            `page=${page}`
        ].filter(Boolean).join('&');
        fetch(`${BASE_URL}?${params}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch images');
                }
                return res.json();
            })
            .then((data) => {
                setImages(data.hits || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [query, order, category, perPage, page]);

    return { images, loading, error };
}
