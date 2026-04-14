import type { Anime, Book, CardData, Manga, Movie, Show } from './types';

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
		subheading: manga.authors ? manga.authors.join(', ') : 'Unknown',
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

export function bookToCardData(book: Book): CardData {
	return {
		id: book.id,
		title: book.title,
		subheading: book.author_name ? book.author_name.join(', ') : 'Unknown',
		image: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
		progressMax: book.pages,
		releaseDate: String(book.first_publish_year),
		score: Number(book.score),
		leftDetails: `${book.pages}*`,
		progressValue: book.progressValue,
		dateAdded: book.dateAdded,
		status: book.status,
		personalRating: book.personalRating
	};
}

export function movieToCardData(movie: Movie): CardData {
	return {
		id: movie.id,
		title: movie.title,
		subheading: '',
		image: 'https://image.tmdb.org/t/p/w500' + movie.cover_image,
		progressMax: 1,
		releaseDate: String(movie.release_year),
		score: movie.score,
		leftDetails: '',
		progressValue: movie.progressValue,
		dateAdded: movie.dateAdded,
		status: movie.status,
		personalRating: movie.personalRating
	};
}

export function showToCardData(show: Show): CardData {
	return {
		id: show.id,
		title: show.title,
		subheading: '',
		image: 'https://image.tmdb.org/t/p/w500' + show.cover_image,
		progressMax: 1,
		releaseDate: String(show.release_year),
		score: show.score,
		leftDetails: '',
		progressValue: show.progressValue,
		dateAdded: show.dateAdded,
		status: show.status,
		personalRating: show.personalRating
	};
}
