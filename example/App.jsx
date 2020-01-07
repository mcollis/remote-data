import React from 'react';
import * as R from 'ramda';
import { union } from 'folktale/adt/union';

import RemoteData, { useRemoteData } from '../src/index.js';

export default () => {
  const [response, onRequest] = useRemoteData(
    'https://jsonplaceholder.typicode.com/posts',
  );

  React.useEffect(onRequest, []);

  return (
    <div style={{ width: '800px', margin: '1.5em auto' }}>
      <h1>RemoteData - useRemoteData</h1>
      {response.matchWith({
        Pending: () => <p>Loading...</p>,
        Success: ({ value }) =>
          value.map(post => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
              <hr />
            </div>
          )),
        Failure: () => (
          <p>An issue occured while connecting to the services.</p>
        ),
        [union.any]: () => null,
      })}
    </div>
  );
};
