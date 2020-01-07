import React from 'react';
import { any } from 'folktale/adt/union/union';
import { useRemoteData } from '@mcollis/remote-data';

const App = () => {
  const [response, onRequest] = useRemoteData(
    'https://jsonplaceholder.typicode.com/posts',
  );
  React.useEffect(onRequest, []);
  return (
    <div>
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
        [any]: () => null,
      })}
    </div>
  );
};

export default App;
