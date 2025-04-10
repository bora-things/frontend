export function capitalizeText(text) {
  const words=text.toLowerCase().split(" ");
  const capitalizedWords=words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join(" ");
}
