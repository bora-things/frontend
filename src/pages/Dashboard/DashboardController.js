export async function fetchUser() {
    const response = await fetch('/src/mocks/UserMockData.json');
    return await response.json();
  }