import * as R from 'ramda';
import assertType from 'folktale/helpers/assert-type';
import assertFunction from 'folktale/helpers/assert-function';
import { union, derivations } from 'folktale/adt/union';
import provideAliases from 'folktale/helpers/provide-fantasy-land-aliases';
import adtMethods from 'folktale/helpers/define-adt-methods';
import Maybe from 'folktale/maybe';

const { equality, debugRepresentation, serialization } = derivations;

const RemoteData = union('RemoteData', {
  NotAsked() {
    return {};
  },
  Pending(value) {
    return { value };
  },
  Failure(value) {
    return { value };
  },
  Success(value) {
    return { value };
  },
}).derive(equality, debugRepresentation, serialization);

const { NotAsked, Pending, Failure, Success } = RemoteData;

const assertRemoteData = assertType(RemoteData);

/*~
 * ~belongsTo: RemoteData
 */
adtMethods(RemoteData, {
  map: {
    NotAsked: function map(f) {
      assertFunction('RemoteData.NotAsked#map', f);
      return this;
    },
    Pending: function map(f) {
      assertFunction('RemoteData.Pending#map', f);
      if (Maybe.hasInstance(this.value)) {
        return this.value.matchWith({
          Just: ({ value }) => Pending(f(value)),
          Nothing: () => this,
        });
      }
      return this;
    },
    Failure: function map(f) {
      assertFunction('RemoteData.Failure#map', f);
      return this;
    },
    Success: function map(f) {
      assertFunction('RemoteData.Success#map', f);
      return Success(f(this.value));
    },
  },

  ap: {
    NotAsked: function apply(anRemoteData) {
      assertRemoteData('RemoteData.NotAsked#apply', anRemoteData);
      return this;
    },
    Pending: function apply(anRemoteData) {
      assertRemoteData('RemoteData.Pending#apply', anRemoteData);
      return this;
    },
    Failure: function apply(anRemoteData) {
      assertRemoteData('RemoteData.Failure#apply', anRemoteData);
      return this;
    },
    Success: function apply(anRemoteData) {
      assertRemoteData('RemoteData.Success#apply', anRemoteData);
      return anRemoteData.map(this.value);
    },
  },

  chain: {
    NotAsked: function chain(f) {
      assertFunction('RemoteData.NotAsked#chain', f);
      return this;
    },
    Pending: function chain(f) {
      assertFunction('RemoteData.Pending#chain', f);
      return this;
    },
    Failure: function chain(f) {
      assertFunction('RemoteData.Failure#chain', f);
      return this;
    },
    Success: function chain(f) {
      assertFunction('RemoteData.Success#chain', f);
      return f(this.value);
    },
  },

  getOrElse: {
    NotAsked: function getOrElse(_default) {
      return _default;
    },
    Pending: function getOrElse(_default) {
      return Maybe.hasInstance(this.value)
        ? this.value.getOrElse(_default)
        : _default;
    },
    Failure: function getOrElse(_default) {
      return _default;
    },
    // eslint-disable-next-line no-unused-vars
    Success: function getOrElse(_default) {
      return this.value;
    },
  },

  orElse: {
    NotAsked: function orElse(handler) {
      assertFunction('RemoteData.NotAsked#orElse', handler);
      return handler(this.value);
    },
    Pending: function orElse(handler) {
      assertFunction('RemoteData.Pending#orElse', handler);
      return handler(this.value);
    },
    Failure: function orElse(handler) {
      assertFunction('RemoteData.Failure#orElse', handler);
      return handler(this.value);
    },
    Success: function orElse(handler) {
      assertFunction('RemoteData.Success#orElse', handler);
      return this;
    },
  },

  concat: {
    NotAsked: function concat(aRemoteData) {
      assertRemoteData('RemoteData.NotAsked#concat', aRemoteData);
      return this;
    },
    Pending: function concat(aRemoteData) {
      assertRemoteData('RemoteData.Pending#concat', aRemoteData);
      return this;
    },
    Failure: function concat(aRemoteData) {
      assertRemoteData('RemoteData.Failure#concat', aRemoteData);
      return this;
    },
    Success: function concat(aRemoteData) {
      assertRemoteData('RemoteData.Success#concat', aRemoteData);
      return aRemoteData.map(xs => this.value.concat(xs));
    },
  },

  sequence: {
    NotAsked: function sequence(of) {
      assertFunction('RemoteData.NotAsked#sequence', of);
      return of(this);
    },
    Pending: function sequence(of) {
      assertFunction('RemoteData.Pending#sequence', of);
      return of(this);
    },
    Failure: function sequence(of) {
      assertFunction('RemoteData.Failure#sequence', of);
      return of(this);
    },
    Success: function sequence(of) {
      assertFunction('RemoteData.Success#sequence', of);
      return this.traverse(of, R.identity);
    },
  },

  traverse: {
    NotAsked: function traverse(of, fn) {
      assertFunction('RemoteData.NotAsked#traverse', of);
      assertFunction('RemoteData.NotAsked#traverse', fn);
      return of(this);
    },
    Pending: function traverse(of, fn) {
      assertFunction('RemoteData.Pending#traverse', of);
      assertFunction('RemoteData.Pending#traverse', fn);
      return of(this);
    },
    Failure: function traverse(of, fn) {
      assertFunction('RemoteData.Failure#traverse', of);
      assertFunction('RemoteData.Failure#traverse', fn);
      return of(this);
    },
    Success: function traverse(of, fn) {
      assertFunction('RemoteData.Success#traverse', of);
      assertFunction('RemoteData.Success#traverse', fn);
      return fn(this.value).map(RemoteData.of);
    },
  },
});

Object.assign(RemoteData, {
  of(value) {
    return Success(value);
  },
  toMaybe(rd) {
    return rd.matchWith({
      Success: ({ value }) => Maybe.Just(value),
      Pending: ({ value }) => R.defaultTo(Maybe.Nothing(), value),
      [union.any]: () => Maybe.Nothing(),
    });
  },
  fromMaybe(mb) {
    return mb.matchWith({
      Just: ({ value }) => RemoteData.Success(value),
      Nothing: () => RemoteData.NotAsked(),
    });
  },
  first: R.curry((a, b) =>
    a.matchWith({
      Success: () => a,
      [union.any]: () => b,
    }),
  ),
  getOrElse: R.curry((_default, rd) => rd.getOrElse(_default)),
});

provideAliases(NotAsked.prototype);
provideAliases(Pending.prototype);
provideAliases(Failure.prototype);
provideAliases(Success.prototype);
provideAliases(RemoteData);

export default RemoteData;
export { NotAsked, Pending, Success, Failure };
