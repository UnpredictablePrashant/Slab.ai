const getErrorMessage = async (response: Response) => {
  try {
    const data = await response.json()
    if (data?.message) return data.message as string
    if (typeof data === 'string') return data
    return JSON.stringify(data)
  } catch (_) {
    return response.statusText || 'Request failed'
  }
}

export async function http<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)
  if (!response.ok) {
    const message = await getErrorMessage(response)
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const jsonHeaders = { 'Content-Type': 'application/json' }
