import React from 'react';

const Admin = () => (
  <div className="row">
    <h1>Admin features</h1>
    <button className="btn btn-default" type="submit">Launch sync</button>
    <button className="btn btn-default" type="submit">Launch push</button>
    <button className="btn btn-default" type="submit">Launch purge</button>
  </div>
);

export default Admin;
