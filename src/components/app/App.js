
import { Layout, Spin, Alert, Tabs, Pagination } from 'antd';
import { Component } from 'react';
import './app.css';

import MovieServiсe from '../../services/MovieService';
import { Provider } from '../../context/Context';
import Movie from '../movie/Movie';
import NetworkState from '../../utils/NetworkState';
import SearchMovie from '../searchMovie/SearchMovie';
import constants from '../../constants';

const { TabPane } = Tabs;

class App extends Component {
    movieService = new MovieServiсe();

    constructor() {
        super();
        this.state = {
            isLoading: true,
            movies: [],
            error: false,
            network: false,
            searchQuery: 'return',
            page: 1,
            total: 0,
            genres: null,
            starsFilms: [],
            currentPage: 'search',
            sessionId: null,
        };
    }

    onError = () => {
        this.setState({
            error: true,
            isLoading: false,
        });
    };

    onNetworkState = () => {
        this.setState(prevState => ({ network: !prevState.network }));
    };

    componentDidMount() {
        this.movieService.createSession().then((session) => this.updateStateSessionId(session));
        this.movieService.getGenres().then((genre) => this.updateStateGenres(genre));
        this.getMovies();
    };

    componentDidUpdate(prevProps, prevState) {
        const { searchQuery, page, currentPage } = this.state;
        if (prevState.searchQuery !== searchQuery || prevState.page !== page) {
            this.getMovies();
        }
        if (currentPage === 'rated') this.onGetRate();
    }

    updateStateSessionId = (session) => {
        this.setState({ sessionId: session.data.guest_session_id });
    };

    updateStateGenres = (genre) => {
        this.setState({ genres: genre.data.genres });
    };

    onGetRate = () => {
        const { sessionId } = this.state;
        this.movieService.getRateMovies(sessionId).then(this.renderCardMovies()).catch(this.onError);;
    };

    onChangeRate = (id, rate) => {
        const { sessionId, movies, starsFilms } = this.state;
        const guestSession = sessionId;
        this.movieService.setRateMovies(id, guestSession, rate);
        localStorage.setItem(id, rate);

        movies.filter(el => {
            if (el.id === id) {
                if (!starsFilms.length) this.setState({ starsFilms: [el] });
                if (starsFilms.length) {
                    const isRatedfilm = starsFilms.findIndex(elem => elem.id === id);
                    const filmWithNewRating = [...starsFilms.slice(0, isRatedfilm), el, ...starsFilms.slice(isRatedfilm + 1)];

                    if (isRatedfilm) this.setState({ starsFilms: [...filmWithNewRating] });
                    if (isRatedfilm === -1) this.setState({ starsFilms: [...starsFilms, el] });
                };
            } return el;
        });
    };

    onSearchQuery = (query) => {
        this.setState({
            searchQuery: query,
            isLoading: true,
            page: 1,
        });
    };

    getMovies = () => {
        const { searchQuery, page } = this.state;
        this.movieService.getMovies(searchQuery, page).then(({ results, total_pages: total }) => {
            this.setState({
                movies: results,
                isLoading: false,
                total: total * 10,
            });
        }).catch(this.onError);;
    };

    onChangePage = (page) => {
        this.setState({
            page,
            isLoading: true,
        });
    };

    renderCardMovies = () => {
        const { movies, currentPage, starsFilms } = this.state;

        if (movies.length === 0) {
            <Alert className='nofilms' message="The search has not given any results. Please enter a different movie title" />;
        }
        let currentDataForPage = movies;
        if (currentPage === 'rated') {
            currentDataForPage = starsFilms;
        } else currentDataForPage = movies;

        return currentDataForPage.map((el) => {
            return <Movie
                key={el.id}
                poster={el.poster_path}
                title={el.title}
                rating={el.vote_average}
                date={el.release_date}
                summary={el.overview}
                genresIds={el.genre_ids}
                onChangeRate={this.onChangeRate}
                movieId={el.id} />;
        });
    };

    handlePage = (currentPage) => {
        currentPage === 'rated' ? this.setState({ currentPage: 'rated' }) : this.setState({ currentPage: 'search' });
    };

    render() {
        const { isLoading, error, network, page, total, genres, starsFilms } = this.state;
        return (
            <Provider value={genres}>
                <Layout className='container'>
                    <NetworkState onNetworkState={this.onNetworkState} />
                    {network ? <Alert className='alert alert-net' message={constants.messageFailNet} /> : null}
                    {error ? <Alert className='alert' message={constants.messageFailUrl} type="error" showIcon /> : null}
                    <Tabs defaultActiveKey="1" onChange={this.handlePage} >
                        <TabPane tab="Search" key="search">
                            <SearchMovie onSearchQuery={this.onSearchQuery} />
                            < div className='wrapper-movies'>
                                {isLoading ? <Spin className='spin' /> : this.renderCardMovies()}
                            </div>
                            <Pagination showSizeChanger={false} current={page} total={total} onChange={this.onChangePage} />
                        </TabPane>
                        <TabPane tab="Rated" key="rated"  >
                            < div className='wrapper-movies'>
                                {!starsFilms.length ? <Alert className='nofilms' message={constants.messageWillRate} /> : this.renderCardMovies()}
                            </div>
                        </TabPane>
                    </Tabs>
                </Layout>;
            </Provider >
        );
    }
}

export default App;
