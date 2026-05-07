export type Status = 'completed' | 'progress' | 'planned';
export type Category = 'books' | 'anime' | 'manga' | 'movies' | 'shows';

export interface Book {
	id: string;
	title: string;
	author_name: string[];
	edition_count: number;
	first_publish_year: number;
	cover_i: number;
	progressValue?: number;
	dateAdded?: string;
	pages: number;
	score: number;
	status?: Status;
	personalRating?: number;
}
export type VideoType = 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Music' | 'Special' | 'tv_special' | 'pv';

export interface Anime {
	id: number;
	title: string;
	score: number;
	cover_image: string;
	episodes: number;
	year: number;
	release_season: string;
	studio: string; // Replace with array for multiple studios later
	dateAdded?: string;
	progressValue?: number;
	themes: string[];
	videoType: string;
	personalRating?: number;
	status?: Status;
}

export interface Manga {
	id: number;
	title: string;
	score: number;
	authors: string[];
	cover_image: string;
	type: string;
	chapters: number;
	volumes: number;
	releaseStatus: string;
	releaseYear: number;
	themes: string[];
	dateAdded?: string;
	progressValue?: number;
	personalRating?: number;
	status?: Status;
}

export interface Movie {
	id: number;
	title: string;
	score: number;
	cover_image: string;
	release_year: number;
	dateAdded?: string;
	progressValue?: number;
	status?: Status;
	personalRating?: number;
}

export interface Show {
	id: number;
	title: string;
	score: number;
	cover_image: string;
	release_year: number;
	dateAdded?: string;
	progressValue?: number;
	status?: Status;
	personalRating?: number;
	seasons?: number;
	networks?: string;
	episodes?: string[];
	total_episodes?: number;
}

export interface CardData {
	id: string | number;
	title: string;
	subheading: string;
	image: string;
	progressMax: number;
	releaseDate: string;
	score: number;
	leftDetails: string;
	progressValue?: number;
	dateAdded?: string;
	status?: Status;
	personalRating?: number;
}
