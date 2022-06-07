
import { Layout, Spin, Alert, Input, Tabs, Pagination } from 'antd';
import { Component } from 'react';
import axios from 'axios'; 

import Movie from './Movie';
import NetworkState from './NetworkState';

const { TabPane } = Tabs;
class App extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            movies: [],
            error: false,
            network: false,
        };
    }

    onError = () => {
        this.setState({
            error: true,
            isLoading: false,
        });
    };

    onNetworkState = () => {
        this.setState(prevState => ({network: !prevState.network}));
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
        const { movies, isLoading, error, network } = this.state;
        return <>
            <Layout className='container'>
                <NetworkState onNetworkState={this.onNetworkState} />
                {network ? <Alert className='alert alert-net' message='Ooops! The Internet connection is interrupted, we are trying to restore it...' /> : null}
                {error ? <Alert className='alert' message="Something has gone wrong" type="error" showIcon /> : null}
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="Search" key="1">
                        <Input placeholder="Type to search" />
                        < div className='wrapper-movies'>
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
                        <Pagination defaultCurrent={1} total={10}/>
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
