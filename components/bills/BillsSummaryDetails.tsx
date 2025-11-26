type Bill = {
	id: string
	title: string
	amount: number
	dueLabel: string
	paid: boolean
	category?: string
	date: string
}

export default function BillsSummaryDetails({
	bills,
}: {
	bills: Bill[]
}) {
	const summary = (() => {
		const now = new Date()
		const today = now.getUTCDate()

		const paid = bills.filter(
			b => new Date(b.date).getUTCDate() <= today,
		)
		const dueSoon = bills.filter(b => {
			const d = new Date(b.date).getUTCDate()
			return d === today + 1 || d === today + 2
		})
		const upcoming = bills.filter(
			b => new Date(b.date).getUTCDate() > today + 2,
		)

		return {
			paidTotal: paid.reduce((s, b) => s + b.amount, 0),
			upcomingTotal: upcoming.reduce((s, b) => s + b.amount, 0),
			dueSoonCount: dueSoon.length,
		}
	})()

	return (
		<div className="bg-white rounded-xl p-4 shadow-sm">
			<h4 className="text-sm font-medium mb-3">Summary</h4>
			<div className="space-y-3 text-sm">
				<div className="flex justify-between">
					<div className="text-gray-600">Paid Bills</div>
					<div className="font-medium">
						${summary.paidTotal.toFixed(2)}
					</div>
				</div>
				<div className="flex justify-between">
					<div className="text-gray-600">Total Upcoming</div>
					<div className="font-medium">
						${summary.upcomingTotal.toFixed(2)}
					</div>
				</div>
				<div className="flex justify-between">
					<div className="text-red-500">Due Soon</div>
					<div className="text-red-500 font-medium">
						{summary.dueSoonCount} bills
					</div>
				</div>
			</div>
		</div>
	)
}
