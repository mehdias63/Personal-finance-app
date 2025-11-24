import BillItem from './BillItem'

type Bill = {
	id: string
	title: string
	amount: number
	dueLabel: string
	paid: boolean
	category?: string
}

type Props = {
	bills: Bill[]
}

export default function BillsList({ bills }: Props) {
	if (!bills || bills.length === 0) {
		return (
			<div className="py-8 text-center text-gray-500">
				No bills found
			</div>
		)
	}

	return (
		<div className="rounded-md border">
			<div className="hidden md:grid grid-cols-[1fr_160px] gap-4 px-4 py-3 text-xs text-gray-500 border-b">
				<div>Bill Title</div>
				<div className="text-right">Amount</div>
			</div>
			<div>
				{bills.map(b => (
					<div key={b.id} className="px-4">
						<BillItem bill={b} />
					</div>
				))}
			</div>
			<div className="py-4 px-4 flex items-center justify-between">
				<div className="text-sm text-gray-500">
					Showing {bills.length} bills
				</div>
				<div className="text-sm text-gray-500"></div>
			</div>
		</div>
	)
}
