import { type Movie, type Anime, type Book, type Manga, type Show } from '$lib/types';
import { MediaStore } from './MediaTemplate.svelte';

interface RawOpenLibraryBook {
	key: string;
	title: string;
	cover_i: number;
	first_publish_year: number;
	author_name: string[];
	edition_count: number;
	number_of_pages_median: number;
	ratings_average: number;
}

interface RawJikanAnime {
	mal_id: number;
	title: string;
	score: number;
	images: { jpg: { image_url: string } };
	episodes: number;
	aired: { prop: { from: { year: number; month: number } } };
	studios: Array<{ name: string }>;
	themes: string[];
	type: string;
}

interface RawJikanManga {
	mal_id: number;
	title: string;
	chapters: number;
	volumes: number;
	score: number;
	authors: Array<{ name: string }>;
	images: { jpg: { image_url: string } };
	type: string;
	status: string;
	published: { prop: { from: { year: number } } };
	themes: string[];
}

export const bookStore = new MediaStore<Book, RawOpenLibraryBook>({
	prefix: 'books',
	fetchUrl: (q) => {
		const key = localStorage.getItem('google_books_api_key');
		const useProxy = localStorage.getItem('use_books_backend_proxy') === 'true';
		if (key)
			return `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${key}`;
		if (useProxy) return `/api/book?q=${encodeURIComponent(q)}`;
		return `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}`;
	},
	transform: (d) => ({
		id: d.key,
		title: d.title,
		cover_i: d.cover_i,
		first_publish_year: d.first_publish_year,
		author_name: d.author_name,
		edition_count: d.edition_count,
		pages: d.number_of_pages_median,
		score: d.ratings_average ? d.ratings_average * 2 : null
	})
});

function getSeason(month: number): string {
	if ([12, 1, 2].includes(month)) return 'Winter';
	if ([3, 4, 5].includes(month)) return 'Spring';
	if ([6, 7, 8].includes(month)) return 'Summer';
	if ([9, 10, 11].includes(month)) return 'Fall';
	return 'Unknown';
}

function convertAnimeVideoType(type: string): string {
	switch (type) {
		case 'TV':
			return 'Ep';
		case 'Movie':
			return 'Movie';
		case 'tv_special':
			return 'Sp';
		case 'Special':
			return 'Sp';
		default:
			return type;
	}
}

export const animeStore = new MediaStore<Anime, RawJikanAnime>({
	prefix: 'anime',
	fetchUrl: (q) => `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}`,
	transform: (d) => ({
		id: d.mal_id,
		title: d.title,
		score: d.score,
		cover_image: d.images.jpg.image_url,
		episodes: d.episodes,
		year: d.aired.prop.from.year,
		release_season: getSeason(d.aired.prop.from.month),
		studio: d.studios[0]?.name || 'Unknown', // Should replace with logic to handle multiple studios
		themes: d.themes,
		videoType: convertAnimeVideoType(d.type)
	})
});

export const mangaStore = new MediaStore<Manga, RawJikanManga>({
	prefix: 'manga',
	fetchUrl: (q) => `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(q)}`,
	transform: (d) => ({
		id: d.mal_id,
		title: d.title,
		chapters: d.chapters,
		volumes: d.volumes,
		score: d.score,
		authors: d.authors.map((author) => author.name),
		cover_image: d.images.jpg.image_url,
		type: d.type,
		releaseStatus: d.status,
		releaseYear: d.published.prop.from.year,
		themes: d.themes
	})
});

export const movieStore = new MediaStore<Movie>({
	prefix: 'movies',
	fetchUrl: (q) => {
		const key = localStorage.getItem('tmdb_api_key');
		if (key)
			return `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodeURIComponent(q)}`;
		return `/api/tmdb/movie?q=${encodeURIComponent(q)}`;
	},
	transform: (d: any) => ({
		id: d.id,
		title: d.title,
		cover_image: d.poster_path,
		score: d.vote_average,
		release_year: d.relase_date ? parseInt(d.relase_date.split('-')[0]) : 0
	})
});

export const showStore = new MediaStore<Show>({
	prefix: 'shows',
	fetchUrl: (q) => {
		const key = localStorage.getItem('tmdb_api_key');
		if (key)
			return `https://api.themoviedb.org/3/search/tv?api_key=${key}&query=${encodeURIComponent(q)}`;
		return `/api/tmdb/tv?q=${encodeURIComponent(q)}`;
	},
	transform: (d: any) => ({
		id: d.id,
		title: d.name,
		cover_image: d.poster_path,
		score: d.vote_average,
		release_year: d.first_air_date ? parseInt(d.first_air_date.split('-')[0]) : 0
	})
});
