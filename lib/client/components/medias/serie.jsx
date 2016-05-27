import React from 'react';

const leftPad = int => ((int <= 9) ? `0${int}` : int);

class Serie extends React.Component {
  render() {
    if (!this.props.data) {
      return null;
    }

    const data = this.props.data;

    const original = !data.original_title
      ? null
      : (
      <span>
        <em>({data.original_title})</em> |
      </span>
    );

    const overview = !data.overview
      ? null
      : (
      <div className="mt10">
        <h4>Synopsis</h4>
        <div className="overview">{data.overview}</div>
      </div>
    );

    let info = null;
    if (this.props.display !== 'small') {
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

      info = (
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

    let episodes = null;
    if (data.episodes && data.episodes.length) {
      const list = data.episodes.map(e => {
        const season = leftPad(e.season);
        const episode = leftPad(e.episode);
        return (
          <div key={e.id}>
            Season <strong>{season}</strong>
            &nbsp;
            episode <strong>{episode}</strong>
            &nbsp;
            -
            &nbsp;
            <a href={`/media/${e.id}`} target="_blank">see more</a>
          </div>
        );
      });
      episodes = (
        <div className="mt10">
          {list}
        </div>
      );
    }

    return (
      <div className="row p-media mb15">
        <div className="col-md-2">
          <img
            className="img-responsive poster"
            src={data.poster}
            alt={`${data.title} poster`}
          />
        </div>
        <div className="col-md-10">
          <h3 className="mt0">
            {data.title} <small>S{data.season}E{data.episode}</small>
          </h3>
          <div className="text-muted">
            {original} {data.genres} | {data.votes}
          </div>
          {overview}
          {episodes}
          {info}
        </div>
      </div>
    );
  }
}

Serie.propTypes = {
  data: React.PropTypes.object.isRequired,
  display: React.PropTypes.oneOf(['large', 'small']),
};

export default Serie;
