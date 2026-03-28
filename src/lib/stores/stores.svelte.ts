import { type Anime, type Book, type Manga } from '$lib/types';
import { MediaStore } from './MediaTemplate.svelte';

export const bookStore = new MediaStore<Book>({
	prefix: 'books',
	fetchUrl: (q) => `/api/openlibrary/search.json?title=${encodeURIComponent(q)}`,
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

export const animeStore = new MediaStore<Anime>({
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
		videoType: d.type
	})
});

export const mangaStore = new MediaStore<Manga>({
	prefix: 'manga',
	fetchUrl: (q) => `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(q)}`,
	transform: (d) => ({
		id: d.mal_id,
		title: d.title,
		chapters: d.chapters,
		volumes: d.volumes,
		score: d.score,
		authors: d.authors.map((author: any) => author.name),
		cover_image: d.images.jpg.image_url,
		type: d.type,
		releaseStatus: d.status,
		releaseYear: d.published.prop.from.year,
		themes: d.themes
	})
});
