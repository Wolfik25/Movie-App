import { Card, Image, Typography, Tag, Rate } from 'antd';
import { format } from 'date-fns';

import { Consumer } from './Context';
import cutText from './CutText';

const { Title, Paragraph, Text } = Typography;

function Movie({ title, date, summary, genresIds, poster, rating }) {
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

    return (
        <Consumer>
            {
                (genres) => (
                    <Card >
                        <Image width={183} height={281} src={`https://image.tmdb.org/t/p/w500/${poster}`} />
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
                        <Rate count={10} />
                    </Card>
                )
            }
        </Consumer>
    );
}

export default Movie;