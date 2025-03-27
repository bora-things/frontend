export async function getProfiles() {
    const response = await fetch('/src/pages/Profile/ProfileMockData.json');
    return await response.json();
  }