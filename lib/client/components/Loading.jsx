import React from 'react';
import { Glyphicon } from 'react-bootstrap';

const Loading = () => (
  <div className="text-center loading">
    <Glyphicon glyph="repeat" />
    <div className="mt10">
      Loading...
    </div>
  </div>
);

export default Loading;
