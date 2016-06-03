import React from 'react';
import { Link } from 'react-router';
import SelectPeriod from './SelectPeriod';
import SelectEmail from './SelectEmail';
import Media from '../components/Cardx';

class Whatsnew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      period: 1,
      data: null,
    };
    this.onPeriodChange = this.onPeriodChange.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  onPeriodChange(event) {
    this.setState({
      loading: true,
      period: parseInt(event.target.value, 10),
      data: null,
    }, () => {
      this.fetchData();
    });
  }
  fetchData() {
    fetch(`/api/whatsnew?period=${this.state.period}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          loading: false,
          data: data.data,
        });
      });
  }
  render() {
    if (this.state.loading === true) {
      return <div>Loading...</div>;
    }

    const data = this.state.data;
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
      <div>
        <div className="row">
          <div className="col-md-10">
            <Block className="movies" title="Movies">{movies}</Block>
            <Block className="series" title="Series">{series}</Block>
            <Block className="unknown" title="Unknown">{unknown}</Block>
            <Block className="removed" title="Removed">{removed}</Block>
            {nothing}
          </div>
          <div className="col-md-2">
            <SelectPeriod defaultValue={this.state.period} update={this.onPeriodChange} />
            <div className="mt10 text-left">
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
            <hr />
            <SelectEmail period={this.state.period} />
          </div>
        </div>
      </div>
    );
  }
}

/**
 * @return {null}
 */
const Block = props => {
  if (!props.children) {
    return null;
  }

  return (
    <div id={props.className} className={props.className}>
      <h2 className="bb">{props.title}</h2>
      <div>
        {props.children}
      </div>
    </div>
  );
};

Block.propTypes = {
  title: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  children: React.PropTypes.node,
};

export default Whatsnew;
