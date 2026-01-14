/**
 * Password utility functions for blog password protection
 */

/**
 * Hash a password using SHA-256
 * @param password - The plain text password
 * @returns A promise that resolves to the hex-encoded hash
 */
export async function hashPassword(password: string): Promise<string> {
	if (!password) {
		throw new Error('Password cannot be empty')
	}

	const encoder = new TextEncoder()
	const data = encoder.encode(password)
	const hashBuffer = await crypto.subtle.digest('SHA-256', data)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
	return hashHex
}

/**
 * Verify a password against a hash
 * @param password - The plain text password to verify
 * @param hash - The stored hash to compare against
 * @returns A promise that resolves to true if the password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	if (!password || !hash) {
		return false
	}

	const passwordHash = await hashPassword(password)
	return passwordHash === hash
}

/**
 * Generate a localStorage key for unlocked articles
 * @param slug - The article slug
 * @param hash - The password hash
 * @returns The localStorage key
 */
export function getUnlockKey(slug: string, hash: string): string {
	return `unlocked_${slug}_${hash}`
}

/**
 * Check if an article is unlocked in localStorage
 * @param slug - The article slug
 * @param hash - The password hash
 * @returns True if the article is unlocked
 */
export function isUnlocked(slug: string, hash: string): boolean {
	if (typeof window === 'undefined') return false
	const key = getUnlockKey(slug, hash)
	return localStorage.getItem(key) === 'true'
}

/**
 * Mark an article as unlocked in localStorage
 * @param slug - The article slug
 * @param hash - The password hash
 */
export function setUnlocked(slug: string, hash: string): void {
	if (typeof window === 'undefined') return
	const key = getUnlockKey(slug, hash)
	localStorage.setItem(key, 'true')
}
