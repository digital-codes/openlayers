import {spy as sinonSpy} from 'sinon';
import {
  forEach as forEachSegment,
  getIntersectionPoint,
} from '../../../../../src/ol/geom/flat/segments.js';
import expect from '../../../expect.js';

describe('ol/geom/flat/segments.js', function () {
  describe('forEach', function () {
    let flatCoordinates, offset, end, stride;
    beforeEach(function () {
      flatCoordinates = [0, 0, 1, 1, 2, 2, 3, 3];
      offset = 0;
      end = 8;
      stride = 2;
    });
    describe('callback returns undefined', function () {
      it('executes the callback for each segment', function () {
        const args = [];
        const spy = sinonSpy(function (point1, point2) {
          args.push([point1[0], point1[1], point2[0], point2[1]]);
        });
        const ret = forEachSegment(flatCoordinates, offset, end, stride, spy);
        expect(spy.callCount).to.be(3);
        expect(args[0][0]).to.be(0);
        expect(args[0][1]).to.be(0);
        expect(args[0][2]).to.be(1);
        expect(args[0][3]).to.be(1);
        expect(args[1][0]).to.be(1);
        expect(args[1][1]).to.be(1);
        expect(args[1][2]).to.be(2);
        expect(args[1][3]).to.be(2);
        expect(args[2][0]).to.be(2);
        expect(args[2][1]).to.be(2);
        expect(args[2][2]).to.be(3);
        expect(args[2][3]).to.be(3);
        expect(ret).to.be(false);
      });
    });
    describe('callback returns true', function () {
      it('executes the callback for the first segment', function () {
        const args = [];
        const spy = sinonSpy(function (point1, point2) {
          args.push([point1[0], point1[1], point2[0], point2[1]]);
          return true;
        });
        const ret = forEachSegment(flatCoordinates, offset, end, stride, spy);
        expect(spy.callCount).to.be(1);
        expect(args[0][0]).to.be(0);
        expect(args[0][1]).to.be(0);
        expect(args[0][2]).to.be(1);
        expect(args[0][3]).to.be(1);
        expect(ret).to.be(true);
      });
    });
    it('returns coordinates with the correct stride', function () {
      const spy = sinonSpy();
      forEachSegment([0, 0, 0, 1, 1, 1, 2, 2, 2], 0, 9, 3, spy);
      expect(spy.callCount).to.be(2);
      expect(spy.firstCall.args).to.eql([
        [0, 0, 0],
        [1, 1, 1],
      ]);
      expect(spy.secondCall.args).to.eql([
        [1, 1, 1],
        [2, 2, 2],
      ]);
    });
  });

  describe('getIntersectionPoint()', () => {
    it('returns the intersection point', () => {
      const segment1 = [
        [0, 0],
        [1, 1],
      ];
      const segment2 = [
        [0, 1],
        [1, 0],
      ];
      const intersection = getIntersectionPoint(segment1, segment2);
      expect(intersection).to.eql([0.5, 0.5]);
    });
    it('returns undefined if there is no intersection', () => {
      const segment1 = [
        [0, 0],
        [1, 1],
      ];
      const segment2 = [
        [0, 2],
        [1, 3],
      ];
      const intersection = getIntersectionPoint(segment1, segment2);
      expect(intersection).to.be(undefined);
    });
    it('returns undefined if the segments are collinear', () => {
      const segment1 = [
        [0, 0],
        [2, 2],
      ];
      const segment2 = [
        [1, 1],
        [3, 3],
      ];
      const intersection = getIntersectionPoint(segment1, segment2);
      expect(intersection).to.be(undefined);
    });
  });
});
