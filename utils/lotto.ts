// utils/lotto.ts
export const generateLottoNumbers = (): number[] => {
  const numbers: number[] = [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return [...numbers].sort((a, b) => a - b);
};
