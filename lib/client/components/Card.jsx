import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col, Image, Thumbnail, Modal, Button, Glyphicon } from 'react-bootstrap';
import YouTube from 'react-youtube';

const leftPad = int => ((int <= 9) ? `0${int}` : int);

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalContent: null,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal(modalContent) {
    this.setState({
      showModal: true,
      modalContent,
    });
  }
  closeModal() {
    this.setState({
      showModal: false,
      modalContent: null,
    });
  }
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
      : data.title;

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
    if (data.decoration) {
      i.push(`status: ${data.decoration}`);
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
        <li><strong className="text-muted">downloaded on</strong> {cd.toDateString()}</li>
      );
    }
    let removed = null;
    if (data.removed) {
      const rd = new Date(data.removed);
      removed = (
        <li><strong className="text-muted">deleted on</strong> {rd.toDateString()}</li>
      );
    }

    let tmdbId = null;
    if (data.tmdbId) {
      let element = null;
      if (data.category === 'movie' || data.category === 'tv') {
        const onOpenTmdbPage = () => {
          event.preventDefault();
          window.open(`https://www.themoviedb.org/${data.category}/${data.tmdbId}`);
        };
        element = (<a href="#" onClick={onOpenTmdbPage}>{data.tmdbId}</a>);
      } else {
        element = data.tmdbId;
      }

      tmdbId = <li><strong className="text-muted">TMDB id</strong> {element}</li>;
    }

    let imdbId = null;
    if (data.imdbId) {
      let element2 = null;
      if (data.category === 'movie' || data.category === 'tv') {
        const onOpenImdbPage = () => {
          event.preventDefault();
          window.open(`http://www.imdb.com/title/${data.imdbId}`);
        };
        element2 = (<a href="#" onClick={onOpenImdbPage}>{data.imdbId}</a>);
      } else {
        element2 = data.imdbId;
      }

      imdbId = <li><strong className="text-muted">IMDB id</strong> {element2}</li>;
    }

    return (
      <div className="mt10">
        <ul className="list-inline text-right">
          {language} {quality} {codec} {size}
        </ul>
        <ul className="list-inline text-right text-muted small">
          <li><strong>id</strong> {data.id}</li>
          {' '}
          {tmdbId}
          {' '}
          {imdbId}
          {' '}
          {created}
          {' '}
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
  videos() {
    if (this.props.mode === 'small' || !this.props.data.videos) {
      return null;
    }

    const options = {
      playerVars: {
        autoplay: 1,
      },
    };

    return (
      <div className="mt10">
        <h4>Videos</h4>
        <Row>
          {this.props.data.videos.map(v => (
            <Col key={v.key} xs={6} md={4}>
              <Thumbnail src={`http://img.youtube.com/vi/${v.key}/mqdefault.jpg`} />
              <Button
                className="cp"
                bsSize="large"
                style={{
                  position: 'absolute',
                  left: '41%',
                  top: '35%',
                }}
                onClick={() => {
                  this.openModal(
                    <YouTube videoId={v.key} opts={options} />
                  );
                }}
              ><Glyphicon glyph="play" /></Button>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
  images() {
    if (this.props.mode === 'small' || !this.props.data.images) {
      return null;
    }

    return (
      <div className="mt10">
        <h4>Images</h4>
        <Row>
          {this.props.data.images.map(i => (
            <Col key={i.file_path} xs={6} md={2}>
              <Thumbnail
                className="cp"
                src={`https://image.tmdb.org/t/p/w185/${i.file_path}`}
                onClick={() => {
                  this.openModal(
                    <Image
                      responsive src={`https://image.tmdb.org/t/p/w780/${i.file_path}`}
                      style={{ margin: 'auto' }}
                    />
                  );
                }}
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }
  credits() {
    if (this.props.mode === 'small' || !this.props.data.credits) {
      return null;
    }

    const openPerson = id => e => {
      e.preventDefault();
      window.open(`https://www.themoviedb.org/person/${id}`);
    };

    const Person = props => (
      <Col key={props.name} xs={6} sm={3} className="m5 p5" style={{ minHeight: 72 }}>
        <Image
          className="pull-left mr10 cp"
          style={{ width: 45, height: 68 }}
          src={props.profile_path ? `https://image.tmdb.org/t/p/w92/${props.profile_path}` : 'http://placehold.it/45?text=no+image'}
          alt={props.name}
          onClick={openPerson(props.id)}
        />
        <div className="mt5">
          <strong className="cp" onClick={openPerson(props.id)}>{props.name}</strong>
          {props.character ? <p>as {props.character}</p> : null}
        </div>
      </Col>
    );

    let direction = null;
    if (this.props.data.credits.direction) {
      direction = (
        <Row>
          <Col xs={12}>
            <h4>Directed by</h4>
          </Col>
          {this.props.data.credits.direction.map(p => <Person {...p} />)}
        </Row>
      );
    }

    let cast = null;
    if (this.props.data.credits.cast) {
      cast = (
        <Row>
          <Col xs={12}>
            <h4>With</h4>
          </Col>
          {this.props.data.credits.cast.map(p => <Person {...p} />)}
        </Row>
      );
    }

    if (!direction && !cast) {
      return null;
    }

    return (
      <div className="mt10">
        {direction}
        {cast}
      </div>
    );
  }
  decorated(data) {
    return (
      <Grid className="p-media bb mb15 pb10">
        <Row>
          <Col xs={12} sm={2}>
            <Image
              responsive
              className="poster mb10"
              src={data.poster}
              alt={`${data.title} poster`}
            />
          </Col>
          <Col xs={12} sm={10}>
            {this.title()}
            {this.detail()}
            {this.overview()}
            {this.episodes()}
            {this.additional()}
            {this.seemore()}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className="bg-info text-center pt20 pr5 pb20 pl5">{data.path}</div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {this.videos()}
            {this.images()}
            {this.credits()}
          </Col>
        </Row>
        <Modal show={this.state.showModal} bsSize="large" onHide={this.closeModal}>
          <Modal.Header closeButton />
          <Modal.Body>
            <div className="text-center">
              {this.state.modalContent}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Grid>
    );
  }
  unknown(data) {
    let title = data.base;
    if (data.title) {
      title = data.title;
    }
    return (
      <Row className="p-media bb mb15 pb10">
        <Col>
          <h4 className="mt0">
            <Link to={`/medias/${data.id}`}>{title}{' '}</Link>
          </h4>
          <ul className="list-inline text-muted small">
            <li><strong>path:</strong> {data.path}</li>
          </ul>
        </Col>
      </Row>
    );
  }
  render() {
    const data = this.props.data;
    if (!data) {
      return null;
    }

    if (this.props.mode === 'small') {
      if (data.decoration === 'undecorated' || data.decoration === 'failed') {
        return this.unknown(data);
      }
    }

    return this.decorated(data);
  }
}

Card.propTypes = {
  data: React.PropTypes.object,
  mode: React.PropTypes.oneOf(['small', 'large']).isRequired,
};

export default Card;
