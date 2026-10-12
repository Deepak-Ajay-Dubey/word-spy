// Text Fitting & Dynamic Scaling Utilities to prevent awkward mid-word breaks

export function getNameSizeClass(name: string): string {
  const len = (name || '').trim().length;
  if (len <= 7) {
    return 'text-2xl sm:text-3xl';
  } else if (len <= 11) {
    return 'text-xl sm:text-2xl';
  } else if (len <= 15) {
    return 'text-lg sm:text-xl';
  } else {
    return 'text-base sm:text-lg';
  }
}

export function getWordSizeClass(word: string): string {
  const len = (word || '').trim().length;
  if (len <= 8) {
    return 'text-2xl sm:text-3xl';
  } else if (len <= 14) {
    return 'text-xl sm:text-2xl';
  } else if (len <= 18) {
    return 'text-lg sm:text-xl';
  } else {
    return 'text-base sm:text-lg';
  }
}
