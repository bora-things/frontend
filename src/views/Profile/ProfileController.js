export async function getProfiles() {
    const response = await fetch('/src/views/Profile/ProfileMockData.json');
    return await response.json();
  }