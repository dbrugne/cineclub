import React from 'react';
import { Link } from 'react-router';
import Section from './Section';
import Media from '../components/Card';

const Left = props => {
  const data = props.data;
  if (!data) {
    return <div className="col-md-10">Loading...</div>;
  }

  const movies = (!data.movies || !data.movies.length)
    ? null
    : data.movies.map(e => (<Media key={e.data.id} data={e.data} mode="small" />));
  const series = (!data.series || !data.series.length)
    ? null
    : data.series.map(e => (<Media key={e.data.title} data={e.data} mode="small" />));
  const unknown = (!data.unknown || !data.unknown.length)
    ? null
    : data.unknown.map(e => (
      <div key={e.data.id} className="small">
        {e.data.base} - <Link to={`/medias/${e.data.id}`}>see more</Link>
      </div>
  ));
  const removed = (!data.removed || !data.removed.length)
    ? null
    : data.removed.map(e => (
      <div key={e.data.id} className="small">
        {e.data.base} - <Link to={`/medias/${e.data.id}`}>see more</Link>
      </div>
  ));

  const nothing = (!movies && !series && !unknown && !removed)
    ? <div>Nothing for this period, try changing it in the right column.</div>
    : null;

  return (
    <div className="col-md-10">
      <h1>What's new</h1>
      <Section className="movies" title="Movies">{movies}</Section>
      <Section className="series" title="Series">{series}</Section>
      <Section className="unknown" title="Unknown">{unknown}</Section>
      <Section className="removed" title="Removed">{removed}</Section>
      {nothing}
    </div>
  );
};

Left.propTypes = {
  data: React.PropTypes.object,
};

export default Left;
