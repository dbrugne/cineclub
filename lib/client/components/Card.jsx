import React from 'react';
import { Link } from 'react-router';

const leftPad = int => ((int <= 9) ? `0${int}` : int);

class Card extends React.Component {
  title() {
    const data = this.props.data;
    let right = null;
    if (data.category === 'movie') {
      right = `${data.category}, ${data.year}`;
    } else if (data.category === 'tv' && !data.episodes) {
      const season = (data.season)
        ? `S${leftPad(data.season)}`
        : null;
      const episode = (data.episode)
        ? `E${leftPad(data.episode)}`
        : null;
      right = `${data.category}, ${season}${episode}`;
    } else {
      right = data.category;
    }

    const title = (!data.episodes)
      ? (<Link to={`/medias/${data.id}`}>{data.title}</Link>)
      : data.title; // @todo : link to search with tv show name

    return (
      <h3 className="mt0">
        {title}{' '}<small>{right}</small>
      </h3>
    );
  }
  detail() {
    const data = this.props.data;
    const i = [];
    if (data.original_title) {
      i.push(data.original_title);
    }
    if (data.genres) {
      i.push(data.genres);
    }
    if (data.votes) {
      i.push(data.votes);
    }
    return (
      <div className="text-muted">
        {i.join(' | ')}
      </div>
    );
  }
  overview() {
    if (!this.props.data.overview) {
      return null;
    }

    const overview = (this.props.mode === 'small' && this.props.data.overview.length > 230)
      ? `${this.props.data.overview.substr(0, 230)} (...)`
      : this.props.data.overview;

    return (
      <div className="mt10">
        <h4>Synopsis</h4>
        <div className="overview">{overview}</div>
      </div>
    );
  }
  episodes() {
    if (!this.props.data.episodes || !this.props.data.episodes.length) {
      return null;
    }

    const data = this.props.data;

    return (
      <div className="mt10">
        {data.episodes.map(e => {
          const season = leftPad(e.season);
          const episode = leftPad(e.episode);
          return (
            <div key={e.id}>
              <Link to={`/medias/${e.id}`}>
                Season <strong>{season}</strong>
                {' '}
                episode <strong>{episode}</strong>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }
  additional() {
    if (this.props.mode === 'small') {
      return null;
    }

    const data = this.props.data;

    const language = !data.language
      ? null
      : (<span><strong className="text-muted">language</strong> {data.language}</span>);
    const quality = !data.quality
      ? null
      : (<span><strong className="text-muted">quality</strong> {data.quality}</span>);
    const codec = !data.codec
      ? null
      : (<span><strong className="text-muted">codec</strong> {data.codec}</span>);
    const size = !data.size
      ? null
      : (<span><strong className="text-muted">size</strong> {data.size}</span>);
    let created = null;
    if (data.created) {
      const cd = new Date(data.created);
      created = (
        <span><strong className="text-muted">downloaded on</strong> {cd.toDateString()}</span>
      );
    }
    let removed = null;
    if (data.removed) {
      const rd = new Date(data.removed);
      removed = (
        <span><strong className="text-muted">deleted on</strong> {rd.toDateString()}</span>
      );
    }

    return (
      <div>
        <div className="bg-info text-center pt20 pr5 pb20 pl5 mt30 mb30">{data.path}</div>
        <ul className="list-inline text-right">
          {language} {quality} {codec} {size}
        </ul>
        <ul className="list-inline text-right text-muted small">
          <li><strong>id</strong> {data.id}</li>
          {created}
          {removed}
        </ul>
      </div>
    );
  }
  seemore() {
    if (this.props.mode === 'large') {
      return null;
    }
    if (this.props.data.episodes) {
      return null;
    }
    return (
      <p className="text-right mt10">
        <Link to={`/medias/${this.props.data.id}`}>see more</Link>
      </p>
    );
  }
  render() {
    if (!this.props.data) {
      return null;
    }

    const data = this.props.data;

    return (
      <div className="row p-media bb mb15 pb10">
        <div className="col-xs-2 col-lg-1">
          <img
            className="img-responsive poster"
            src={data.poster}
            alt={`${data.title} poster`}
          />
        </div>
        <div className="col-xs-10 col-lg-11">
          {this.title()}
          {this.detail()}
          {this.overview()}
          {this.episodes()}
          {this.additional()}
          {this.seemore()}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  data: React.PropTypes.object.isRequired,
  mode: React.PropTypes.oneOf(['small', 'large']).isRequired,
};

export default Card;
