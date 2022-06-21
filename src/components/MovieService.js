import { Component } from 'react';
import axios from 'axios';


class MovieService extends Component {
    constructor() {
        super();
        this.url = 'https://api.themoviedb.org/3';
        this.apikey = '22077a20ad2f607a753b5ab7dd397260';
    };

    getGenres = async () => {
        const apiGenres = `${this.url}/genre/movie/list?api_key=${this.apikey}`;
        const genre = await axios.get(apiGenres);
        return genre;
    };

    getMovies = async (searchQuery, page) => {
        const apiMovie = `${this.url}/search/movie?api_key=${this.apikey}&query=${searchQuery}&page=${page}`;
        const { data: { results, total_pages: total } } = await axios.get(apiMovie);
        return { results, total_pages: total };
    };

    createSession = async () => {
        const apiSession = `${this.url}/authentication/guest_session/new?api_key=${this.apikey}`;
        const session = await axios.get(apiSession);
        return session;
    };

    setRateMovies = async (movieId, sessionId, rate) => {
        const apiSetRate = `${this.url}/movie/${movieId}/rating?api_key=${this.apikey}&&guest_session_id=${sessionId}`;
        const res = await axios.post(apiSetRate, { value: rate });
        return res;
    };

    getRateMovies = async (sessionId) => {
        const apiGetRate = `${this.url}/guest_session/${sessionId}/rated/movies?api_key=${this.apikey}`;
        const rates = await axios.get(apiGetRate);
        return rates;
    };
}

export default MovieService;