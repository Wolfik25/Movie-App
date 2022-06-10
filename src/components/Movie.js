import { Card, Image, Typography, Tag, Rate } from 'antd';
import { format } from 'date-fns';

import cutText from './CutText';

const { Title, Paragraph, Text } = Typography;

function Movie({ title, date, summary, genres, poster, rating }) {

    return (
        <Card >
            <Image width={183} height={281} src={`https://image.tmdb.org/t/p/w500/${poster}`} />
            <Title level={3}>{title}</Title>
            <div className='rating'>{rating}</div>
            <Text>{date ? format(new Date(date), 'd MMMM, Y') : 'Unknown'}</Text>
            <div className='card-tag'>
                <Tag>{genres.map(el => {
                    return el;
                })}</Tag>
                <Tag>Drama</Tag>
            </div>
            <Paragraph className='cut-text'>{cutText(summary)}</Paragraph>
            <Rate count={10}/>
        </Card>
    );
}

export default Movie;