import { Component } from 'react';
import { Card, Image, Typography, Tag, Rate } from 'antd';
import { format } from 'date-fns';

import poster404 from '../img/poster404.jpg';

import { Consumer } from './Context';
import cutText from './CutText';


const { Title, Paragraph, Text } = Typography;

class Movie extends Component {
    constructor() {
        super();
        this.state = {
            value: 0,
        };
    };

    onHandleChangeRate = (value) => {
        const { onChangeRate, movieId } = this.props;
        this.setState({
            value
        });
        onChangeRate(movieId, value);
    };

    render() {
        const { title, date, summary, genresIds, poster, movieId } = this.props;
        const { value } = this.state;
        let { rating } = this.props;

        const stars = +localStorage.getItem(movieId) || value;

        let rateClass;

        if (rating < 3) {
            rateClass = 'rating rating-up-to-three';
        } else if (rating >= 3 && rating < 5) {
            rateClass = 'rating rating-up-to-five';
        } else if (rating >= 5 && rating < 7) {
            rateClass = 'rating rating-up-to-seven';
        } else if (rating >= 7) {
            rateClass = 'rating rating-up-to-ten';
        }
        if (rating.toString().length === 1) rating = `${rating}.0`;

        return (
            <Consumer>
                {
                    (genres) => (
                        <Card >
                            <Image width={183} height={281} src={poster ? `https://image.tmdb.org/t/p/w500/${poster}` : poster404} />
                            <Title level={3}>{title}</Title>
                            <div className={rateClass} >{rating}</div>
                            <Text>{date ? format(new Date(date), 'd MMMM, Y') : 'Unknown'}</Text>
                            <div className='card-tag'>
                                {genresIds.map((id) => {
                                    const genre = genres.find((g) => g.id === id);
                                    return <Tag key={genre.id}>{genre.name}</Tag>;
                                })}
                            </div>
                            <Paragraph className='cut-text'>{cutText(summary)}</Paragraph>
                            <Rate allowHalf count={10} value={stars} onChange={this.onHandleChangeRate} />
                        </Card>
                    )
                }
            </Consumer>
        );
    }
}

export default Movie;