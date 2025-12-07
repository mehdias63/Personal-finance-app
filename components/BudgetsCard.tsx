'use client'

import { formatCurrency } from '@/lib/utils'
import styles from './BudgetsCard.module.css'

type Budget = {
	category: string
	maximum: number
	theme?: string
}

type Transaction = {
	amount: number
	category?: string
}

type Props = {
	budgets?: Budget[]
	transactions?: Transaction[]
	size?: number
}

export default function BudgetsCard({
	budgets = [],
	transactions = [],
	size = 160,
}: Props) {
	const safeBudgets = budgets ?? []
	const safeTx = transactions ?? []

	const budgetWithSpent = safeBudgets.map(b => {
		const spent = safeTx
			.filter(t => t.category === b.category && t.amount < 0)
			.reduce((s, t) => s + Math.abs(t.amount), 0)
		return { ...b, spent }
	})

	const totalMax =
		budgetWithSpent.reduce((s, b) => s + (b.maximum ?? 0), 0) || 1
	const totalSpent = budgetWithSpent.reduce(
		(s, b) => s + (b.spent ?? 0),
		0,
	)

	let acc = 0
	const stops: string[] = budgetWithSpent.map(b => {
		const pct = (b.maximum / totalMax) * 100
		const start = acc
		const end = acc + pct
		acc = end
		const color = b.theme ?? '#7dd3fc'
		return `${color} ${start.toFixed(2)}% ${end.toFixed(2)}%`
	})

	const gradient = stops.length
		? `conic-gradient(${stops.join(', ')})`
		: 'transparent'

	const outer = size
	const inner = Math.round(size * 0.56)

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm">
			<div className="flex justify-between items-start">
				<h3 className="text-lg font-medium">Budgets</h3>
				<button type="button" className="text-sm text-gray-500 hover:text-gray-700">See Details ▸</button>
			</div>

			<div className="mt-4 flex gap-6 items-center">
				<div
					className={styles.donutOuter}
					style={{ width: outer, height: outer } as React.CSSProperties}
				>
					<div
						aria-hidden
						className={styles.donutBackground}
						style={{
							width: outer,
							height: outer,
							background: gradient,
						} as React.CSSProperties}
					/>
					<div
						className={styles.donutCenter}
						style={{ width: inner, height: inner } as React.CSSProperties}
					>
						<div className="font-bold text-lg">
							${formatCurrency(totalSpent)}
						</div>
						<div className="text-xs text-gray-500">
							of ${formatCurrency(totalMax)} limit
						</div>
					</div>
				</div>
				<div className="flex-1">
					<ul className="space-y-3">
						{budgetWithSpent.map((b, idx) => {
							const key = `${b.category}-${idx}`
							const pctOfMax = b.maximum
								? Math.round((b.spent / b.maximum) * 100)
								: 0
							return (
								<li
									key={key}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-3">
										<span
											className={styles.themeBar}
											style={{ backgroundColor: b.theme ?? '#7dd3fc' } as React.CSSProperties}
										/>
										<div>
											<div className="text-sm text-gray-600">
												{b.category}
											</div>
											<div className="text-sm  font-medium">
												${formatCurrency(b.maximum)}
											</div>
										</div>
									</div>
								</li>
							)
						})}
					</ul>
				</div>
			</div>
		</div>
	)
}
