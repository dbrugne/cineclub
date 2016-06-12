import React from 'react';
import { Pagination } from 'react-bootstrap';

const AdvancedPagination = props => (
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
    onSelect={props.onPageChange}
  />
);

AdvancedPagination.propTypes = {
  pages: React.PropTypes.number,
  page: React.PropTypes.number,
  onPageChange: React.PropTypes.func,
};

export default AdvancedPagination;
