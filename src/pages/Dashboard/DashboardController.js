export async function getSubjects() {
    const response = await fetch('/src/pages/Dashboard/DashboardMockData.json');
    return await response.json();
  }