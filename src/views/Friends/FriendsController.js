export async function getFriends() {
    const response = await fetch('/src/views/Friends/FriendsMockData.json');
    return await response.json();
  }