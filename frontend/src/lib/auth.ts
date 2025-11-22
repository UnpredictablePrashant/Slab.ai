const TOKEN_KEY = 'slab_admin_token'

export const getAdminToken = () => localStorage.getItem(TOKEN_KEY)

export const setAdminToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)

export const clearAdminToken = () => localStorage.removeItem(TOKEN_KEY)
