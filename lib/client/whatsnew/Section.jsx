import React from 'react';

const Section = props => {
  if (!props.children.length) {
    return (<div></div>);
  }

  return (
    <div id={props.className} className={props.className}>
      <h3 className="bb">{props.title}</h3>
      <div>
        {props.children}
      </div>
    </div>
  );
};

Section.propTypes = {
  title: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  children: React.PropTypes.node,
};

export default Section;
