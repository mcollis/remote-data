import React from 'react';
import * as R from 'ramda';
import { Nothing, Just } from 'folktale/maybe';
import { any } from 'folktale/adt/union/union';

import { NotAsked, Pending, Success, Failure } from '../remote-data';

const useRemoteData = (url, init = {}) => {
  const [response, setResponse] = React.useState(NotAsked());

  const onRequest = React.useCallback(() => {
    response.matchWith({
      Pending: ({ value }) => Pending(value),
      Success: ({ value }) => Just(value) |> Pending,
      [any]: () => Nothing() |> Pending,
    }) |> setResponse;

    fetch(url, init)
      |> R.then(result => (result.ok ? result.json() : Promise.reject(result)))
      |> R.then(result => Success(result) |> setResponse)
      |> R.otherwise(error => Failure(error) |> setResponse);
  }, [url, init]);

  return [response, onRequest];
};

export default useRemoteData;
