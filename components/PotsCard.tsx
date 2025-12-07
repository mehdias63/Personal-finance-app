'use client'

import { Currency } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

type Pot = {
	name: string
	total: number
	theme?: string
}

type Props = {
	pots?: Pot[]
}

export default function PotsCard({ pots = [] }: Props) {
	const safePots = pots ?? []
	const totalSaved = safePots.reduce((s, p) => s + (p.total ?? 0), 0)
	const firstFour = safePots.slice(0, 4)
	const rows = []
	for (let i = 0; i < firstFour.length; i += 2) {
		rows.push(firstFour.slice(i, i + 2))
	}

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm">
			<div className="flex justify-between items-start">
				<h3 className="text-lg font-medium">Pots</h3>
				<button type="button" className="text-sm text-gray-500 hover:text-gray-700">See Details ▸</button>
			</div>
			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="rounded-xl bg-[#f3efec] p-5 flex items-center gap-4">
					<div className="p-3 bg-white rounded-xl shadow-sm">
						<Currency className="w-6 h-6 text-green-800" />
					</div>
					<div>
						<div className="text-sm text-gray-600">Total Saved</div>
						<div className="text-3xl font-bold mt-1">
							${formatCurrency(totalSaved)}
						</div>
					</div>
				</div>
				<div className="space-y-4">
					{rows.map((pair, rowIndex) => (
						<div key={`row-${rowIndex}`} className="grid grid-cols-2 gap-6">
							{pair.map((pot) => (
								<div key={pot.name} className="flex items-center gap-3">
									<div
										className="w-1 h-10 rounded"
										style={{ background: pot.theme ?? '#10b981' }}
									></div>
									<div>
										<div className="text-sm text-gray-500">
											{pot.name}
										</div>
										<div className="text-xs font-medium">
											${pot.total.toFixed(0)}
										</div>
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
