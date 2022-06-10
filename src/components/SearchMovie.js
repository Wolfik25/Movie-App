import { Input } from 'antd';
import _debounce from 'lodash.debounce';


function SearchMovie({ onSearchQuery }) {
    const onChangeHandler = (e) => {
        const query = e.target.value;
        if (!query.trim()) return;
        onSearchQuery(query);
    };
    return <Input placeholder="Type to search" onChange={_debounce(onChangeHandler, 500)}/>;
}

export default SearchMovie;




// getViewMovies = () => {
//     const { movies } = this.state;
//     if (movies.length < 1) {
//         <Alert className='nofilms' message="The search has not given any results. Please enter a different movie title" />;
//     }

//     return movies.map((el) => {
//         return <Movie
//             key={el.id}
//             poster={el.poster_path}
//             title={el.title}
//             rating={el.vote_average}
//             date={el.release_date}
//             summary={el.overview}
//             genres={el.genre_ids} />;
//     });
// }