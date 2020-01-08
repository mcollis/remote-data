import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Posts from './Posts';
import Post from './Post';

ReactDOM.render(
  <div style={{ margin: '1.5em auto', maxWidth: '800px' }}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Posts} />
        <Route
          path="/post/:id"
          render={({ match }) => <Post id={match.params.id} />}
        />
      </Switch>
    </BrowserRouter>
  </div>,
  document.getElementById('root'),
);
