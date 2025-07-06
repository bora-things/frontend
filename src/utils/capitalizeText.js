export function capitalizeText(text) {
  if(!text || typeof text !== 'string') {
    return '';
  }
  const words=text.toLowerCase().split(" ");
  const capitalizedWords=words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join(" ");
}
