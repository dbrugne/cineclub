import React from 'react';

const Header = props => {
  let headerCss;
  let headerContent;
  if (props.error) {
    headerCss = 'bg-danger';
    headerContent = `Error while retrieving: ${props.error}`;
  } else if (props.nothing) {
    headerCss = 'bg-warning';
    headerContent = 'Nothing found.';
  } else {
    headerCss = 'dn';
  }

  return (
    <div className={`p15 ${headerCss}`}>
      {headerContent}
    </div>
  );
};

Header.propTypes = {
  error: React.PropTypes.string,
  nothing: React.PropTypes.bool,
};

export default Header;
