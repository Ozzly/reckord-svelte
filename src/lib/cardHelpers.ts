import type { Anime, CardData, Manga } from './types';

export function animeToCardData(anime: Anime): CardData {
	return {
		id: anime.id,
		title: anime.title,
		subheading: anime.studio,
		image: anime.cover_image,
		progressMax: anime.episodes,
		releaseDate: `${anime.release_season} ${anime.year}`,
		score: anime.score,
		leftDetails: `${anime.videoType === 'Movie' ? 'Movie' : anime.episodes || 'No'} ${anime.videoType === 'Movie' ? '' : anime.videoType || 'Ep'}`,
		progressValue: anime.progressValue,
		dateAdded: anime.dateAdded,
		status: anime.status,
		personalRating: anime.personalRating
	};
}

export function mangaToCardData(manga: Manga): CardData {
	return {
		id: manga.id,
		title: manga.title,
		subheading: manga.authors.join(', '),
		image: manga.cover_image,
		progressMax: manga.chapters,
		releaseDate: `${manga.releaseYear}`,
		score: manga.score,
		leftDetails: `${manga.chapters} ch ${manga.volumes} vol`,
		progressValue: manga.progressValue,
		dateAdded: manga.dateAdded,
		status: manga.status,
		personalRating: manga.personalRating
	};
}
