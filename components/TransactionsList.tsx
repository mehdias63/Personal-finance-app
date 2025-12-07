'use client'

import Image from 'next/image'
import { normalizeImageSrc } from '@/lib/utils'

type Transaction = {
	avatar: string
	name: string
	category: string
	date: string
	amount: number
	recurring: boolean
}

type Props = {
	transactions: Transaction[]
	title?: string
}

export default function TransactionsList({
	transactions,
	title = 'Transactions',
}: Props) {
	return (
		<div className="bg-white rounded-xl p-6 shadow-sm">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-medium">{title}</h3>
				<button type="button" className="text-sm text-gray-500 hover:text-gray-700">View All ▸</button>
			</div>

			<ul className="space-y-4">
				{transactions.map((tx, index) => {
					const key = `${tx.name}-${tx.date}-${index}`
					const imgSrc = normalizeImageSrc(tx.avatar)

					return (
						<li
							key={key}
							className="flex items-center justify-between py-3 border-b last:border-b-0"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full overflow-hidden">
									<Image
										src={imgSrc}
										alt={tx.name}
										width={40}
										height={40}
									/>
								</div>
								<div className="font-medium">{tx.name}</div>
							</div>
							<div>
								<div
									className={`text-sm ${
										tx.amount >= 0
											? 'text-emerald-600'
											: 'text-gray-800'
									}`}
								>
									{tx.amount >= 0
										? `+ $${Math.abs(tx.amount).toFixed(2)}`
										: `- $${Math.abs(tx.amount).toFixed(2)}`}
								</div>
								<div className="text-xs text-gray-500">
									{new Date(tx.date).toLocaleDateString()}
								</div>
							</div>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
