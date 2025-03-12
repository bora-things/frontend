export async function getComponents() {
    const response = await fetch('/src/pages/LandingPage/LandingPageMockData.json');
    return await response.json();
  }

export async function getDoubts() {
  const response = await fetch('/src/pages/LandingPage/LandingPageMockData.json');
  return await response.json();
}