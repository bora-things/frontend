export async function getFriends() {
    const response = await fetch('/src/pages/Friends/FriendsMockData.json');
    return await response.json();
  }