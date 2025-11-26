import BillsSummaryDetails from './BillsSummaryDetails'
import { Bill } from '@/types'

type Props = {
	bills: Bill[]
}

export default function BillsSummary({ bills }: Props) {
	const total = bills.reduce((s, b) => s + b.amount, 0)

	return (
		<div className="space-y-6">
			<div className="bg-[#111115] text-white rounded-xl p-6 shadow-md">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
							>
								<path
									d="M7 10h10v7H7z"
									stroke="white"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M9 6h6"
									stroke="white"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<div>
							<div className="text-xs text-white/70">Total Bills</div>
							<div className="text-2xl font-bold mt-2">
								${total.toFixed(2)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<BillsSummaryDetails bills={bills} />
		</div>
	)
}
