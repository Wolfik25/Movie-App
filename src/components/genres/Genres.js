import { Component } from 'react';
import { Tag } from 'antd';

import { Consumer } from '../../context/Context';

class Genres extends Component {

    render() {
        const { genresIds } = this.props;
        return (
            <Consumer>
                {
                    (genres) => (
                        <div className='card-tag'>
                            {genresIds.map((id) => {
                                const genre = genres.find((g) => g.id === id);
                                return <Tag key={genre.id}> {genre.name}</Tag>;
                            })}
                        </div>
                    )
                }
            </Consumer>
        );
    }
};

export default Genres;