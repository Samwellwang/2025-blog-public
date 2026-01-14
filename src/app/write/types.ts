export type PublishForm = {
	slug: string
	title: string
	md: string
	tags: string[]
	date: string
	summary: string
	password?: string // Plain text password (will be hashed before saving)
}

export type ImageItem = { id: string; type: 'url'; url: string } | { id: string; type: 'file'; file: File; previewUrl: string; filename: string; hash?: string }
