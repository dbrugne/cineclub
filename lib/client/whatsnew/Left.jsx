import React from 'react';
import { Link } from 'react-router';
import Section from './Section';
import Media from '../components/Card';

const Left = props => {
  if (props.isFetching === true) {
    return <div className="col-md-10">Loading...</div>;
  }

  let headerCss;
  let headerContent;
  const isEmpty = (
    !props.movies.length
    && !props.series.length
    && !props.unknown.length
    && !props.removed.length
  );
  if (props.error) {
    headerCss = 'bg-danger';
    headerContent = `Error while retrieving what's new: ${props.error}`;
  } else if (isEmpty) {
    headerCss = 'bg-warning';
    headerContent = 'Nothing new during this period, try changing it in the right column.';
  } else {
    headerCss = 'dn';
  }

  return (
    <div className="col-md-10">
      <h1>What's new</h1>
      <div className={`p15 ${headerCss}`}>
        {headerContent}
      </div>
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
        {props.unknown.map(e =>
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
