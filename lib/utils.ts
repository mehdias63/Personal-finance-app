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

/**
 * Formats a number as currency with 2 decimal places
 */
export function formatCurrency(amount: number): string {
	return amount.toFixed(2)
}

/**
 * Creates CSS custom properties for dynamic theme colors
 * This is the recommended way to handle dynamic colors in React components
 */
export function themeStyle(color: string | undefined) {
	return {
		'--theme-color': color || 'transparent',
		backgroundColor: color,
	} as React.CSSProperties
}

/**
 * Creates CSS properties for progress bars with dynamic width
 */
export function progressStyle(
	width: number | string,
	color?: string,
): React.CSSProperties {
	return {
		width: typeof width === 'number' ? `${width}%` : width,
		...(color && { backgroundColor: color }),
	}
}
