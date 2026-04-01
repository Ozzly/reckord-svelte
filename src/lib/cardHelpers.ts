import type { Anime, CardData } from './types';

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
