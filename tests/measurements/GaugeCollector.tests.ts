import { expect } from 'chai';

import { GaugeCollector } from '../../src/measurements/index.js';

describe('GaugeCollector', () => {
  it('should accumulate metrics with the same key', () => {
    const collector = new GaugeCollector();
    collector.measure({
      name: 'test',
      value: 42,
    });
    collector.measure({
      name: 'test',
      value: 24,
    });
    expect(collector.flush()).to.deep.equal([
      {
        name: 'test',
        sum: 66,
        count: 2,
        max: 42,
        min: 24,
        last: 24,
        stddev: 9,
        period: undefined,
        source: undefined,
        tags: undefined,
        time: undefined,
      },
    ]);
  });

  it('should accumulate metrics separately if they have different sources', () => {
    const collector = new GaugeCollector();
    collector.measure({
      name: 'test',
      value: 42,
      source: 'source1',
    });
    collector.measure({
      name: 'test',
      value: 24,
      source: 'source2',
    });
    expect(collector.flush()).to.deep.equal([
      {
        name: 'test',
        value: 42,
        source: 'source1',
        tags: undefined,
      },
      {
        name: 'test',
        value: 24,
        source: 'source2',
        tags: undefined,
      },
    ]);
  });

  it('should clear cached metrics after flush', () => {
    const collector = new GaugeCollector();
    collector.measure({
      name: 'test',
      value: 42,
    });
    expect(collector.flush()).to.have.length(1);
    expect(collector.flush()).have.length(0);
  });
});
