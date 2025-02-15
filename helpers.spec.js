const {
  flattenArr,
  dataFetcher,
  sortList,
  formatCurrency,
  handlePromises
} = require('./helpers.js');
const axios = require('axios');

jest.mock('axios');

describe('flattenArr', () => {
  it('return a non-nested arr', () => {
    const input = [1, 2, 3, 4];
    const expectedOutput = [1, 2, 3, 4];

    expect(flattenArr(input)).toEqual(expectedOutput);
  });

  it('flattens a nested arr', () => {
    const input = [1, 2, 3, [4, 5, [6, 7, [8, [9, [10]]]]]];
    const expectedOutput = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    expect(flattenArr(input)).toEqual(expectedOutput);
  });
});

describe('dataFetcher', () => {
  it('handles a successful response', async () => {
    axios.get.mockImplementation(() => Promise.resolve({ data: { users: [] } }));

    const data = await dataFetcher();

    expect(data).toEqual({ data: { users: [] } });
  });

  it('handles an error response', async () => {
    axios.get.mockImplementation(() => Promise.reject('Boom'));

    try {
      await dataFetcher();
    } catch (e) {
      expect(e).toEqual(new Error({ error: 'Boom', message: 'An Error Occurred' }));
    }
  });
});

describe('sortList', () => {
  it('calls a sorter function if it is available', () => {
    const sortFn = jest.fn();

    sortList([3, 2, 1], sortFn);

    expect(sortFn).toBeCalled();
    expect(sortFn).toBeCalledTimes(1);
    expect(sortFn.mock.calls).toEqual([[[3, 2, 1]]]);
  });

  it('does not call a sorter function if the array has a length <= 1', () => {
    const sortFn = jest.fn();

    sortList([1], sortFn);

    expect(sortFn).not.toBeCalled();
    expect(sortFn).toBeCalledTimes(0);
  });
});

describe('formatCurrency', () => {
  it('returns $0.00 if param is not a number', () => {
    const input = 'word';

    expect(formatCurrency(input)).toEqual('$0.00');
  });

  it('returns a properly formatted string if param is a number', () => {
    const input = 20;

    expect(formatCurrency(input)).toEqual('$20.00');
  })
});

describe('handlePromises', () => {
  it('returns an array of resolved promises', async () => {
    const promise1 = new Promise((res, rej) => res('hello'));
    const promise2 = new Promise((res, rej) => res('world'));

    const data = await handlePromises([promise1, promise2]);

    expect(data).toEqual(['hello', 'world']);
  });

  it('resolves a rejected promise', async () => {
    const promise1 = new Promise((res, rej) => rej('error'));

    const data = await handlePromises([promise1]);

    expect(data).toEqual(new Error('error'));
  })
});
