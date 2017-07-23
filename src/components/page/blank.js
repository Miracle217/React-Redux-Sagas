import React from 'react';
import { connect } from 'react-redux';

export const Blank = ({title, message}) => {
  console.log(title, message);
  return (
    <div className="content animate-panel">
      <main className="main">
        <div className="g-row">
          <h2>{title}</h2>
          <div className="g-col">
            {message}
          </div>
        </div>
      </main>
    </div>
  );
};

export default connect(state => ({
  title: state.ui.title,
  message: state.ui.message
}))(Blank);
