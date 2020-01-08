import * as R from 'ramda';
import Maybe from 'folktale/maybe';

import RemoteData from './remote-data';

describe('RemoteData', () => {
  describe('Laws', () => {
    describe('Functor', () => {
      const r = RemoteData.of('Goodbye');
      test('Identity', () => {
        const law1 = R.map(R.identity);
        const law2 = R.identity;
        expect(law1(r)).toEqual(law2(r));
      });
      test('Composition', () => {
        const fn1 = R.append(' cruel');
        const fn2 = R.append(' world');
        const law1 = R.compose(R.map(fn2), R.map(fn1));
        const law2 = R.map(R.compose(fn2, fn1));
        expect(law1(r)).toEqual(law2(r));
      });
    });
    describe('Monad', () => {
      const of = RemoteData.of;
      const join = R.chain(of);
      test('Identity', () => {
        const r = of(of('foo'));
        const law1 = R.compose(join, of);
        const law2 = R.compose(join, R.map(of));
        expect(law1(r)).toEqual(law2(r));
      });
      test('Associativity', () => {
        const r = of(of(of('foo')));
        const law1 = R.compose(join, R.map(join));
        const law2 = R.compose(join, join);
        expect(law1(r)).toEqual(law2(r));
      });
    });
    describe('Applicative', () => {
      const of = RemoteData.of;
      test('Identity', () => {
        const r = of('foo');
        const law = R.ap(of(R.identity));
        expect(law(r)).toEqual(r);
      });
      test('Homomorphism', () => {
        const law1 = R.compose(R.ap(of(R.toUpper)), of);
        const law2 = R.compose(of, R.toUpper);
        expect(law1('foo')).toEqual(law2('foo'));
      });
      test('Interchange', () => {
        const v = of(R.reverse);
        const law1 = R.compose(R.ap(v), of);
        const law2 = x => of(R.applyTo(x)).ap(v);
        expect(law1('foo')).toEqual(law2('foo'));
      });
      test('Composition', () => {
        const compose = f => g => x => f(g(x));
        const u = of(R.toUpper);
        const v = of(R.concat(R.__, '& beyond'));
        const w = of('blood bath ');
        const law1 = of(compose)
          .ap(u)
          .ap(v)
          .ap(w);
        const law2 = u.ap(v.ap(w));
        expect(law1).toEqual(law2);
      });
    });
    describe('Traversable', () => {
      test('Identity', () => {
        const r = RemoteData.of('foo');
        const law1 = R.compose(R.sequence(Maybe.of), R.map(Maybe.of));
        const law2 = Maybe.of;
        expect(law1(r)).toEqual(law2(r));
      });
      test('Naturality', () => {
        const r = RemoteData.of(Maybe.of('foo'));
        const law1 = (of, nt) => R.compose(nt, R.sequence(of));
        const law2 = (of, nt) => R.compose(R.sequence(of), R.map(nt));
        expect(law1(Maybe.of, RemoteData.fromMaybe)(r)).toEqual(
          law2(RemoteData.of, RemoteData.fromMaybe)(r),
        );
      });
    });
    describe('Natural Transformation', () => {
      const fn = R.toUpper;
      test('toMaybe', () => {
        const r = RemoteData.of('foo');
        const law1 = R.compose(R.map(fn), RemoteData.toMaybe);
        const law2 = R.compose(RemoteData.toMaybe, R.map(fn));
        expect(law1(r)).toEqual(law2(r));
      });
      test('fromMaybe', () => {
        const r = Maybe.of('foo');
        const law1 = R.compose(R.map(fn), RemoteData.fromMaybe);
        const law2 = R.compose(RemoteData.fromMaybe, R.map(fn));
        expect(law1(r)).toEqual(law2(r));
      });
    });
  });
});
