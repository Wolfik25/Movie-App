import { Component } from 'react';
import axios from 'axios';


class MovieService extends Component {
    constructor() {
        super();
        this.url = 'https://api.themoviedb.org/3';
        this.apikey = '22077a20ad2f607a753b5ab7dd397260';
    };

    setRequest = async (resource, searchQuery, page, sessionId, rate) => {
        let request = `${this.url}${resource}?api_key=${this.apikey}`;

        if (searchQuery && page) {
            request = `${this.url}${resource}?api_key=${this.apikey}&query=${searchQuery}&page=${page}`;
            const { data: { results, total_pages: total } } = await axios.get(request);
            return { results, total_pages: total };
        }

        if (sessionId && rate) {
            request = `${this.url}${resource}?api_key=${this.apikey}&&guest_session_id=${sessionId}`;
            const res = await axios.post(request, { value: rate });
            return res;
        }

        let res = await axios.get(request);

        return res;
    };

    getGenres = () => {
        return this.setRequest('/genre/movie/list');
    };

    getMovies = (searchQuery, page) => {
        return this.setRequest('/search/movie', searchQuery, page);
    };

    createSession = () => {
        return this.setRequest('/authentication/guest_session/new');
    };

    setRateMovies = (movieId, sessionId, rate) => {
        return this.setRequest(`/movie/${movieId}/rating`, null, null, sessionId, rate);
    };

    getRateMovies = async (sessionId) => {
        return this.setRequest(`/guest_session/${sessionId}/rated/movies`);
    };
}

export default MovieService;