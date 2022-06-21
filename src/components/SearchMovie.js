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