import React from 'react';
import { any } from 'folktale/adt/union/union';
import { Link } from 'react-router-dom';
import { useRemoteData } from '@mcollis/remote-data';

type Props = {
  id: Number,
};

type PostResponse = {
  id: Number,
  title: String,
  body: String,
};

type CommentResponse = {
  id: Number,
  name: String,
  body: String,
  email: String,
};

type ResponseProps = {
  value: {
    post: PostResponse,
    comments: [CommentResponse],
  },
};

const lift2A = (fn, a1, a2) => a1.map(fn).ap(a2);

const Post = ({ id }: Props) => {
  const [postResponse, onPostRequest] = useRemoteData(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
  );

  const [commentsResponse, onCommentsRequest] = useRemoteData(
    `https://jsonplaceholder.typicode.com/comments?postId=${id}`,
  );

  const response = React.useMemo(
    () =>
      lift2A(
        post => comments => ({ post, comments }),
        postResponse,
        commentsResponse,
      ),
    [postResponse, commentsResponse],
  );

  React.useEffect(() => {
    onPostRequest();
    onCommentsRequest();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {response.matchWith({
        Pending: () => <p>Loading...</p>,
        Success: ({ value: { post, comments } }: ResponseProps) => (
          <>
            <Link to="/">&lt; Back to posts</Link>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
            <hr />
            <>
              <h2>Comments:</h2>
              {comments.map(comment => (
                <blockquote
                  key={comment.id}
                  style={{
                    borderLeft: '6px solid lightgrey',
                    padding: '0 1.5em',
                    margin: '1.5em 0',
                  }}
                >
                  <h3>
                    {comment.name}
                    <br />
                    <small>
                      <em>&lt; {comment.email} &gt;</em>
                    </small>
                  </h3>
                  <p>{comment.body}</p>
                </blockquote>
              ))}
            </>
          </>
        ),
        Failure: () => <p>Problem connecting to the services.</p>,
        [any]: () => null,
      })}
    </>
  );
};

export default Post;
