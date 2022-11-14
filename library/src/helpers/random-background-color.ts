/**
 * Generate random color based on a unique hash
 */
export default (stringInput: string) => {
  const stringUniqueHash = [...stringInput].reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return `hsla(${stringUniqueHash % 360}, 95%, 35%, 0.5)`;
};
