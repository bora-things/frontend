export async function getComponents() {
    const response = await fetch('/src/views/LandingPage/LandingPageMockData.json');
    return await response.json();
  }

export async function getDoubts() {
  const response = await fetch('/src/views/LandingPage/LandingPageMockData.json');
  return await response.json();
}