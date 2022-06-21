
import { Layout, Spin, Alert, Tabs, Pagination } from 'antd';
import { Component } from 'react';

import Movie from './Movie';
import NetworkState from './NetworkState';
import SearchMovie from './SearchMovie';
import { Provider } from './Context';
import MovieServiсe from './MovieService';

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
        this.movieService.createSession().then((session) => { this.setState({ sessionId: session.data.guest_session_id }); });
        this.movieService.getGenres().then((genre) => { this.setState({ genres: genre.data.genres }); });
        this.getMovies();
    };

    componentDidUpdate(prevProps, prevState) {
        const { searchQuery, page, currentPage } = this.state;
        if (prevState.searchQuery !== searchQuery) {
            this.getMovies();
        }
        if (prevState.page !== page) {
            this.getMovies();
        }
        if (currentPage === 'rated') this.onGetRate();
    }

    onGetRate = () => {
        const { sessionId } = this.state;
        const guestSession = sessionId;
        this.movieService.getRateMovies(guestSession).then(this.cardMovies()).catch(this.onError);;
    };

    onChangeRate = (id, rate) => {
        const { sessionId, movies, starsFilms } = this.state;
        const guestSession = sessionId;
        this.movieService.setRateMovies(id, guestSession, rate);
        localStorage.setItem(id, rate);

        movies.filter(el => {
            if (el.id === id) {
                if (!starsFilms.length) {
                    this.setState({
                        starsFilms: [el]
                    });
                }
                if (starsFilms.length) {
                    const isRatedfilm = starsFilms.findIndex(elem => elem.id === id);
                    const filmWithNewRating = [...starsFilms.slice(0, isRatedfilm), el, ...starsFilms.slice(isRatedfilm + 1)];
                    if (isRatedfilm) {
                        this.setState({
                            starsFilms: [...filmWithNewRating]
                        });
                    }
                    if (isRatedfilm === -1) {
                        this.setState({
                            starsFilms: [...starsFilms, el]
                        });
                    }
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

    cardMovies = () => {
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

    onHandlePage = (currentPage) => {
        currentPage === 'rated' ? this.setState({ currentPage: 'rated' }) : this.setState({ currentPage: 'search' });
    };

    render() {
        const { isLoading, error, network, page, total, genres, starsFilms } = this.state;
        return (
            <Provider value={genres}>
                <Layout className='container'>
                    <NetworkState onNetworkState={this.onNetworkState} />
                    {network ? <Alert className='alert alert-net' message='Ooops! The Internet connection is interrupted, we are trying to restore it...' /> : null}
                    {error ? <Alert className='alert' message="Something has gone wrong" type="error" showIcon /> : null}
                    <Tabs defaultActiveKey="1" onChange={this.onHandlePage} >
                        <TabPane tab="Search" key="search">
                            <SearchMovie onSearchQuery={this.onSearchQuery} />
                            < div className='wrapper-movies'>
                                {isLoading ? <Spin className='spin' /> : this.cardMovies()}
                            </div>
                            <Pagination showSizeChanger={false} current={page} total={total} onChange={this.onChangePage} />
                        </TabPane>
                        <TabPane tab="Rated" key="rated"  >
                            < div className='wrapper-movies'>
                                {!starsFilms.length ? <Alert className='nofilms' message='Here will your rated films' /> : this.cardMovies()}
                            </div>
                        </TabPane>
                    </Tabs>
                </Layout>;
            </Provider >
        );
    }
}

export default App;
