
import { Layout } from 'antd';
import { Component } from 'react';
import axios from 'axios';

import Movie from './Movie';

class App extends Component {
    constructor() {
        super();
        this.state = {
            movies: [],
        };
    }

    componentDidMount() {
        this.getMovies();
    };

    getMovies = async () => {
        const apiMovie = 'https://api.themoviedb.org/3/search/movie?api_key=22077a20ad2f607a753b5ab7dd397260&query=return';
        const { data: { results } } = await axios.get(apiMovie);
        this.setState({ movies: results });
    };

    render() {
        const { movies } = this.state;
        return <Layout className='container'>
            < div className='wrapper'>
                {movies.map((el) => {
                    return <Movie key={el.id}
                        poster={el.poster_path}
                        title={el.title}
                        date={el.release_date}
                        summary={el.overview}
                        genres={el.genre_ids} />;
                })}
            </div>
        </Layout>;
    }
}

export default App;
