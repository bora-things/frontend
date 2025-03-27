export function useLogout() {
  async function handleLogout() {
    const logoutLink = import.meta.env.VITE_API_URL + '/logout'
    window.location.href = logoutLink
  }

  return {
    handleLogout
  }
}
