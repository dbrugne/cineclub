import React from 'react';
import { Pagination } from 'react-bootstrap';

const AdvancedPagination = props => {
  if (props.pages < 1) {
    return null;
  }

  return (
    <Pagination
      prev
      next
      first
      last
      ellipsis
      boundaryLinks
      items={props.pages}
      maxButtons={5}
      activePage={props.page}
      onSelect={props.changePage}
    />
  );
};

AdvancedPagination.propTypes = {
  pages: React.PropTypes.number,
  page: React.PropTypes.number,
  changePage: React.PropTypes.func,
};

export default AdvancedPagination;
