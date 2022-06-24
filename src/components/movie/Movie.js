import { Component } from 'react';
import { Card, Image, Typography, Rate } from 'antd';
import { format } from 'date-fns';
import './movie.css';

import Genres from '../genres/Genres';
import poster404 from '../../img/poster404.jpg';
import cutText from '../../utils/CutText';
import ratingColor from '../../utils/ratingColor';
import constants from '../../constants';

const { Title, Paragraph, Text } = Typography;

class Movie extends Component {
    constructor() {
        super();
        this.state = {
            value: 0,
        };
    };

    handleChangeRate = (value) => {
        const { onChangeRate, movieId } = this.props;
        this.setState({
            value
        });
        onChangeRate(movieId, value);
    };

    render() {
        const { title, date, summary, poster, genresIds, movieId } = this.props;
        const { value } = this.state;
        let { rating } = this.props;

        const stars = +localStorage.getItem(movieId) || value;

        if (rating.toString().length === 1) rating = `${rating}.0`;

        return (
            <Card >
                <Image width={183} height={281} src={poster ? `${constants.posterUrl}${poster}` : poster404} />
                <Title level={3}>{title}</Title>
                <div className={ratingColor(rating)} >{rating}</div>
                <Text>{date ? format(new Date(date), 'd MMMM, Y') : 'Unknown'}</Text>
                <Genres genresIds={ genresIds} />
                <Paragraph className='cut-text'>{cutText(summary)}</Paragraph>
                <Rate allowHalf count={10} value={stars} onChange={this.handleChangeRate} />
            </Card>
        );
    }
}

export default Movie;