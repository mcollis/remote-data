import React from 'react';
import * as R from 'ramda';
import Maybe from 'folktale/maybe';
import { any } from 'folktale/adt/union/union';

import RemoteData from '../remote-data';

const useRemoteData = (url, init = {}) => {
  const [response, setResponse] = React.useState(RemoteData.NotAsked());

  const onRequest = React.useCallback(() => {
    response.matchWith({
      Pending: ({ value }) => RemoteData.Pending(value),
      Success: ({ value }) => Maybe.Just(value) |> RemoteData.Pending,
      [any]: () => Maybe.Nothing() |> RemoteData.Pending,
    }) |> setResponse;

    fetch(url, init)
      |> R.then(result => (result.ok ? result.json() : Promise.reject(result)))
      |> R.otherwise(error => RemoteData.Failure(error) |> setResponse)
      |> R.then(result => RemoteData.Success(result) |> setResponse);
  }, [response, url, init]);

  return React.useMemo(() => [response, onRequest], [response, onRequest]);
};

export default useRemoteData;
