'use client'

type Props = {
	title: string
	value: string
	variant?: 'primary' | 'default'
}

export default function StatCard({
	title,
	value,
	variant = 'default',
}: Props) {
	const base = 'rounded-xl p-6 shadow-sm'
	const primary = 'bg-[#1f1f21] text-white'
	const def = 'bg-white text-[#111827]'
	return (
		<div
			className={`${base} ${variant === 'primary' ? primary : def}`}
		>
			<div className="text-sm opacity-80">{title}</div>
			<div className={`text-2xl font-semibold mt-2`}>{value}</div>
		</div>
	)
}
