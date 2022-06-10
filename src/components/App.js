
import { Layout, Spin, Alert, Tabs, Pagination } from 'antd';
import { Component } from 'react';
import axios from 'axios';

import Movie from './Movie';
import NetworkState from './NetworkState';
import SearchMovie from './SearchMovie';

const { TabPane } = Tabs;
class App extends Component {
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
        this.getMovies();
    };

    componentDidUpdate(prevProps, prevState) {
        const { searchQuery, page } = this.state;
        if (prevState.searchQuery !== searchQuery) {
            this.getMovies();
        }
        if (prevState.page !== page) {
            this.getMovies();
        }
    }

    onSearchQuery = (query) => {
        this.setState({
            searchQuery: query,
            isLoading: true,
            page: 1,
        });
    };

    getMovies = async () => {
        const { searchQuery, page } = this.state;
        const apiMovie = `https://api.themoviedb.org/3/search/movie?api_key=22077a20ad2f607a753b5ab7dd397260&query=${searchQuery}&page=${page}`;
        const { data: { results, total_pages: total } } = await axios.get(apiMovie)
            .catch(this.onError);
        this.setState({
            movies: results,
            isLoading: false,
            total: total * 10,
        });
    };

    onChangePage = (page) => {
        this.setState({
            page,
            isLoading: true,
        });
    };

    getViewMovies = () => {
        const { movies } = this.state;
        if (movies.length < 1) {
            <Alert className='nofilms' message="The search has not given any results. Please enter a different movie title" />;
        }

        return movies.map((el) => {
            return <Movie
                key={el.id}
                poster={el.poster_path}
                title={el.title}
                rating={el.vote_average}
                date={el.release_date}
                summary={el.overview}
                genres={el.genre_ids} />;
        });
    };


    render() {
        const { isLoading, error, network, page, total } = this.state;
        return <>
            <Layout className='container'>
                <NetworkState onNetworkState={this.onNetworkState} />
                {network ? <Alert className='alert alert-net' message='Ooops! The Internet connection is interrupted, we are trying to restore it...' /> : null}
                {error ? <Alert className='alert' message="Something has gone wrong" type="error" showIcon /> : null}
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="Search" key="1">
                        <SearchMovie onSearchQuery={this.onSearchQuery} />
                        < div className='wrapper-movies'>
                            {isLoading ? <Spin className='spin' /> : this.getViewMovies()}
                        </div>
                        <Pagination showSizeChanger={false} current={page} total={total} onChange={this.onChangePage} />
                    </TabPane>
                    <TabPane tab="Rated" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                </Tabs>
            </Layout>;
        </>;
    }
}

export default App;
