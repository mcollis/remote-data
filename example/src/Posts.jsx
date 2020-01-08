import React from 'react';
import { any } from 'folktale/adt/union/union';
import { Link } from 'react-router-dom';
import { useRemoteData } from '@mcollis/remote-data';

const Posts = () => {
  const [response, onRequest] = useRemoteData(
    'https://jsonplaceholder.typicode.com/posts',
    {
      method: 'GET',
    },
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
              <h2>
                <Link to={`post/${post.id}`}>{post.title}</Link>
              </h2>
              <p>{post.body}</p>
              <hr />
            </div>
          )),
        Failure: () => <p>Problem connecting to the services.</p>,
        [any]: () => null,
      })}
    </div>
  );
};

export default Posts;
