type Bill = {
	id: string
	title: string
	amount: number
	dueLabel: string
	paid: boolean
	category?: string
}

const CATEGORY_COLOR: Record<string, string> = {
	Entertainment: '#277C78',
	Bills: '#82C9D7',
	'Dining Out': '#F2CDAC',
	'Personal Care': '#626070',
	Groceries: '#F9C16B',
	Transportation: '#E55353',
	Education: '#826CB0',
	Lifestyle: '#F59E0B',
	Shopping: '#7C3AED',
	default: '#C4C4C4',
}

export default function BillItem({ bill }: { bill: Bill }) {
	const color = bill.category
		? CATEGORY_COLOR[bill.category] ?? CATEGORY_COLOR.default
		: CATEGORY_COLOR.default

	return (
		<div className="flex items-center justify-between py-4 border-b last:border-b-0">
			<div className="flex items-center gap-4">
				<div
					className="w-10 h-10 rounded-full flex items-center justify-center"
					style={{ background: `${color}20` }}
				>
					<div
						className="w-6 h-6 rounded-full"
						style={{ background: color }}
					/>
				</div>

				<div>
					<div className="font-medium">{bill.title}</div>
					<div className="text-xs text-gray-500">
						{bill.dueLabel}{' '}
						<span
							className={`ml-2 inline-flex items-center text-xs ${
								bill.paid ? 'text-emerald-600' : 'text-red-500'
							}`}
						>
							{bill.paid ? '●' : '●'}
						</span>
					</div>
				</div>
			</div>

			<div className="text-right">
				<div
					className={`font-semibold ${
						bill.paid ? 'text-gray-800' : ''
					}`}
				>
					${bill.amount.toFixed(2)}
				</div>
			</div>
		</div>
	)
}
