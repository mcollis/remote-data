import React from 'react';
import * as R from 'ramda';
import Maybe from 'folktale/maybe';
import union from 'folktale/adt/union/union';

import RemoteData from '../remote-data';

const useRemoteData = (url, init = {}) => {
  const [response, setResponse] = React.useState(RemoteData.NotAsked());

  const onRequest = React.useCallback(() => {
    response.matchWith({
      Pending: ({ value }) => RemoteData.Pending(value),
      Success: ({ value }) => Maybe.Just(value) |> RemoteData.Pending,
      [union.any]: () => Maybe.Nothing() |> RemoteData.Pending,
    }) |> setResponse;

    fetch(url, init)
      |> R.then(result => (result.ok ? result.json() : Promise.reject(result)))
      |> R.then(result => RemoteData.Success(result) |> setResponse)
      |> R.otherwise(error => RemoteData.Failure(error) |> setResponse);
  }, [url, init]);

  return [response, onRequest];
};

export default useRemoteData;
