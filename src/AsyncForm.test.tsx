import React from 'react';
import ReactDOM from 'react-dom';
import AsyncForm from './AsyncForm';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AsyncForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});


