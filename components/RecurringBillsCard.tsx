'use client'

type Bill = {
	id?: string
	name?: string
	amount: number
	dueDate?: string
	paid?: boolean
}

type Props = {
	bills?: Bill[]
}

export default function RecurringBillsCard({ bills }: Props) {
	const safeBills = bills ?? []
	const paid = safeBills
		.filter(b => b.amount > 0)
		.reduce((sum, b) => sum + b.amount, 0)

	const upcoming = safeBills
		.filter(b => b.amount < 0)
		.reduce((sum, b) => sum + Math.abs(b.amount), 0)

	const dueSoon = Math.round(upcoming * 0.3 * 100) / 100

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm">
			<div className="flex justify-between items-start">
				<h3 className="text-lg font-medium">Recurring Bills</h3>
				<a className="text-sm text-gray-500">See Details ▸</a>
			</div>

			<div className="mt-4 space-y-3">
				<div className="flex items-center justify-between p-3">
					<div>Paid Bills</div>
					<div className="font-semibold">${paid.toFixed(2)}</div>
				</div>
				<div className="flex items-center justify-between p-3">
					<div>Total Upcoming</div>
					<div className="font-semibold">${upcoming.toFixed(2)}</div>
				</div>
				<div className="flex items-center justify-between p-3">
					<div>Due Soon</div>
					<div className="font-semibold">${dueSoon.toFixed(2)}</div>
				</div>
			</div>
		</div>
	)
}
