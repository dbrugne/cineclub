import React from 'react';
import { Row, Col, Modal, Button, Image } from 'react-bootstrap';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w92/';
const getPosterComponent = poster => (poster
    ? <Image src={`${POSTER_BASE}${poster}`} />
    : null
);

const Confirmation = props => {
  if (!props.chosen || props.didConfirm) {
    return null;
  }

  return (
    <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Confirm your choice?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={6} md={2}>
              {getPosterComponent(props.chosen.poster_path)}
            </Col>
            <Col xs={12} md={10}>
              <div>
                <strong>title:</strong>
                {' '}
                {props.chosen.title || props.chosen.name || '-'}
                {' '}
                <small>
                  {props.chosen.release_date ? `(${props.chosen.release_date.substr(0, 4)})` : null}
                </small>
              </div>
              <div>
                <strong>original title:</strong>
                {' '}
                {props.chosen.original_title || props.chosen.original_name || '-'}
              </div>
              <div>
                <strong>category:</strong>
                {' '}
                {props.chosen.media_type || '-'}
              </div>
              <div>
                <strong>overview:</strong>
                {' '}
                {props.chosen.overview || '-'}
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.cancel}>Cancel</Button>
          <Button bsStyle="primary" onClick={props.confirm}>Confirm</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};

Confirmation.propTypes = {
  chosen: React.PropTypes.any,
  didConfirm: React.PropTypes.bool,
  data: React.PropTypes.object,
  confirm: React.PropTypes.func,
  cancel: React.PropTypes.func,
};

export default Confirmation;
