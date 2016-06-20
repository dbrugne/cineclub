import React from 'react';
import { Button, Table, Image } from 'react-bootstrap';
import Pagination from '../components/Pagination';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w92/';
const getPosterComponent = poster => (poster
    ? <Image src={`${POSTER_BASE}${poster}`} />
    : null
);

const Results = props => {
  if (!props.items || !props.items.length) {
    return props.didFetch
      ? <div>no result found</div>
      : null;
  }

  return (
    <div>
      <Pagination {...props} />
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>poster</th>
            <th>overview</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>{props.items.map(i => (
          <tr key={i.id}>
            <td>{i.id}</td>
            <td>{getPosterComponent(i.poster_path)}</td>
            <td>
              <div>
                <strong>title:</strong>
                {' '}
                {i.title || i.name || '-'}
                {' '}
                <small>{i.release_date ? `(${i.release_date.substr(0, 4)})` : null}</small>
              </div>
              <div>
                <strong>original title:</strong>
                {' '}
                {i.original_title || i.original_name || '-'}
              </div>
              <div>
                <strong>category:</strong>
                {' '}
                {i.media_type || '-'}
              </div>
              <div>
                <strong>overview:</strong>
                {' '}
                {i.overview || '-'}
              </div>
            </td>
            <td>
              <Button onClick={() => props.choose(i)}>choose!</Button>
            </td>
          </tr>
        ))}</tbody>
      </Table>
      <Pagination {...props} />
    </div>
  );
};

Results.propTypes = {
  didFetch: React.PropTypes.bool,
  items: React.PropTypes.array,
  pages: React.PropTypes.number,
  page: React.PropTypes.number,
  changePage: React.PropTypes.func,
  choose: React.PropTypes.func,
};

export default Results;
