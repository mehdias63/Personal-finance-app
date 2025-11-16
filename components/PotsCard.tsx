'use client'

import { Currency } from 'lucide-react'

type Pot = {
	name: string
	target: number
	total: number
	theme?: string
}

type Props = {
	pots?: Pot[]
}

export default function PotsCard({ pots = [] }: Props) {
	const safePots = pots ?? []
	const totalSaved = safePots.reduce((s, p) => s + (p.total ?? 0), 0)

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm">
			<div className="flex justify-between items-start">
				<h3 className="text-lg font-medium">Pots</h3>
				<a className="text-sm text-gray-500">See Details ▸</a>
			</div>

			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
				<div className="rounded-lg bg-[#f3efec] p-5 flex items-center gap-4">
					<div className="p-3 bg-white rounded-lg shadow-sm">
						<Currency className="w-6 h-6 text-[#2c7b72]" />
					</div>
					<div>
						<div className="text-sm text-gray-600">Total Saved</div>
						<div className="text-2xl font-semibold mt-2">
							${totalSaved.toFixed(0)}
						</div>
					</div>
				</div>
				<div className="space-y-3">
					{safePots.map((pot, idx) => {
						const key = `${pot.name}-${idx}`
						return (
							<div
								key={key}
								className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm"
								style={{ minHeight: 48 }}
							>
								<div className="flex items-center gap-4">
									<div
										aria-hidden
										className="w-1 h-10 rounded"
										style={{ background: pot.theme ?? '#10b981' }}
									/>
									<div>
										<div className="text-sm font-medium">
											{pot.name}
										</div>
										<div className="text-xs text-gray-500">
											${pot.total.toFixed(0)}
										</div>
									</div>
								</div>
								<div className="text-sm text-gray-700 font-medium">
									${pot.total.toFixed(0)}
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
