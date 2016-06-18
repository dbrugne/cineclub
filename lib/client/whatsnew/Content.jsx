import React from 'react';
import { Link } from 'react-router';
import Section from './Section';
import Media from '../components/Card';
import Header from '../components/Header';
import Loading from '../components/Loading';

const Left = props => {
  if (props.isFetching === true) {
    return <Loading />;
  }

  const isEmpty = (
    !props.movies.length
    && !props.series.length
    && !props.unknown.length
    && !props.removed.length
  );

  return (
    <div>
      <h1>What's new</h1>
      <div className="mt10 mb10 text-right">
        Jump to :
        {' '}
        <a href="#movies">Movies</a>
        {' '}
        <a href="#series">Series</a>
        {' '}
        <a href="#unknown">Unknown</a>
        {' '}
        <a href="#removed">Removed</a>
        {' '}
      </div>
      <Header error={props.error} nothing={isEmpty} />
      <Section className="movies" title="Movies">
        {props.movies.map(e => <Media key={e.id} data={e} mode="small" />)}
      </Section>
      <Section className="series" title="Series">
        {props.series.map(e => <Media key={e.title} data={e} mode="small" />)}
      </Section>
      <Section className="unknown" title="Unknown">
        {props.unknown.map(e =>
          <Link className="db" key={e.id} to={`/medias/${e.id}`}>{e.base}</Link>
        )}
      </Section>
      <Section className="removed" title="Removed">
        {props.removed.map(e =>
          <Link className="db" key={e.id} to={`/medias/${e.id}`}>{e.base}</Link>
        )}
      </Section>
    </div>
  );
};

Left.propTypes = {
  isFetching: React.PropTypes.bool,
  error: React.PropTypes.string,
  movies: React.PropTypes.array,
  series: React.PropTypes.array,
  unknown: React.PropTypes.array,
  removed: React.PropTypes.array,
};

export default Left;
