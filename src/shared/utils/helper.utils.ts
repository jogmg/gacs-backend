export const toAcronym = (input: string) => {
  const conjunctions = ['and', '&', 'the', 'of', 'in', 'for'];
  const words = input.toLowerCase().split(' ');

  return words
    .map((word) => (!conjunctions.includes(word) ? word.charAt(0) : ''))
    .join('')
    .toUpperCase();
};
