export default (stringInput: string) => {
  const stringUniqueHash = [...stringInput].reduce((acc, char) => {
    // tslint:disable-next-line
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return `hsla(${stringUniqueHash % 360}, 95%, 35%, 0.5)`;
};
