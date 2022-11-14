import randomBackgroundColor from '../../src/helpers/random-background-color';
describe('random-background-color', () => {
  test('should generate the same output when the same input hash is used', async () => {
    const randomColor = randomBackgroundColor('test');
    const randomColor2 = randomBackgroundColor('test');

    expect(randomColor).toEqual(randomColor2);
  });

  test('should generate the different output when different inputs are used', async () => {
    const randomColor = randomBackgroundColor('test');
    const randomColor2 = randomBackgroundColor('test2');

    expect(randomColor).not.toEqual(randomColor2);
  });
});
