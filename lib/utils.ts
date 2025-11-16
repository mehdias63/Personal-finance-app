import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function normalizeImageSrc(src?: string | null) {
	if (!src) return ''

	if (/^https?:\/\//i.test(src)) return src

	if (src.startsWith('/')) return src

	return src.replace(/^\.\/+/, '/')
}
