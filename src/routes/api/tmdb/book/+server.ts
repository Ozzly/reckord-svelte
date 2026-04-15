import { GOOGLE_BOOKS_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const query = String(url.searchParams.get('q'));
	const response = await fetch(
		`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}`
	);
	const data = await response.json();
	return json(data);
}
