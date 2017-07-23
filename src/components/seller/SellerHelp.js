import React from 'react';

const SHOW = false;

export default () => SHOW ? (
  <div>
    <img src="https://source.unsplash.com/category/people/50x50;" alt="" className="help-photo"/>
    <img src="https://source.unsplash.com/category/people/50x50;" alt="" className="help-photo"/>
    <h2>have a question?</h2>
    <a href="#">ask laura and steven</a>
  </div>
) : null;
