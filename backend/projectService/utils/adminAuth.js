const crypto = require('crypto')

const getAdminSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is not configured')
  }
  return secret
}

const parseTtl = () => {
  const ttl = process.env.ADMIN_TOKEN_TTL_SECONDS
  const parsed = Number(ttl)
  if (!ttl) return 60 * 60 * 24 // default 24h
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error('ADMIN_TOKEN_TTL_SECONDS must be a positive number')
  }
  return parsed
}

const base64UrlEncode = (input) => Buffer.from(JSON.stringify(input)).toString('base64url')

const signAdminToken = (payload = {}) => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const exp = Math.floor(Date.now() / 1000) + parseTtl()
  const tokenPayload = { ...payload, exp }

  const headerSegment = base64UrlEncode(header)
  const payloadSegment = base64UrlEncode(tokenPayload)
  const data = `${headerSegment}.${payloadSegment}`

  const signature = crypto
    .createHmac('sha256', getAdminSecret())
    .update(data)
    .digest('base64url')

  return `${data}.${signature}`
}

const verifyAdminToken = (token) => {
  if (!token) {
    throw new Error('Token is missing')
  }

  const segments = token.split('.')
  if (segments.length !== 3) {
    throw new Error('Invalid token format')
  }

  const [headerSegment, payloadSegment, signature] = segments
  const data = `${headerSegment}.${payloadSegment}`
  const expectedSignature = crypto
    .createHmac('sha256', getAdminSecret())
    .update(data)
    .digest('base64url')

  if (expectedSignature.length !== signature.length) {
    throw new Error('Invalid token signature')
  }

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    throw new Error('Invalid token signature')
  }

  const payloadJson = Buffer.from(payloadSegment, 'base64url').toString('utf8')
  const payload = JSON.parse(payloadJson)
  const now = Math.floor(Date.now() / 1000)

  if (payload.exp && payload.exp < now) {
    throw new Error('Token expired')
  }

  return payload
}

module.exports = {
  signAdminToken,
  verifyAdminToken,
}
