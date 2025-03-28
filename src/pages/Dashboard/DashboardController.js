export async function fetchUser() {
    const response = await fetch('/src/pages/Dashboard/DashboardMockData.json');
    return await response.json();
  }