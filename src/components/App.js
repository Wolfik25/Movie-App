
import { Layout, Spin, Alert } from 'antd';
import { Component } from 'react';
import axios from 'axios';
import { Offline, Online } from 'react-detect-offline';

import Movie from './Movie';

class App extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            movies: [],
            error: false,
        };
    }

    onError = () => {
        this.setState({
            error: true,
            isLoading: false,
        });
    };

    componentDidMount() {
        this.getMovies();
    };

    getMovies = async () => {
        const apiMovie = 'https://api.themoviedb.org/3/search/movie?api_key=22077a20ad2f607a753b5ab7dd397260&query=return';
        const { data: { results } } = await axios.get(apiMovie)
            .catch(this.onError);
        this.setState({
            movies: results,
            isLoading: false,
        });
    };

    render() {
        const { movies, isLoading, error } = this.state;
        return <>
            <Layout className='container'>
                <Offline><Alert message='Failed internet' /></Offline>
                <Online>
                    < div className='wrapper'>
                        {error ? <Alert className='alert' message="Something has gone wrong" type="error" showIcon /> : null}
                        {isLoading ? <Spin className='spin' /> : movies.map((el) => {
                            return <Movie
                                key={el.id}
                                poster={el.poster_path}
                                title={el.title}
                                date={el.release_date}
                                summary={el.overview}
                                genres={el.genre_ids} />;
                        })
                        }
                    </div>
                </Online>
            </Layout>;
        </>;
    }
}

export default App;
