'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

type Pot = {
	name: string
	target: number
	total: number
	theme?: string
}

type Props = {
	pot: Pot
	onEdit?: () => void
	onDelete?: () => void
	onAddMoney?: () => void
	onWithdraw?: () => void
}

export default function PotCard({
	pot,
	onEdit,
	onDelete,
	onAddMoney,
	onWithdraw,
}: Props) {
	const pct = pot.target
		? Math.min(100, (pot.total / pot.target) * 100)
		: 0

	return (
		<div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0ebe7]">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<span
						className="w-3 h-3 rounded-full"
						style={{ background: pot.theme }}
					/>
					<h3 className="font-medium">{pot.name}</h3>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="text-gray-400 hover:text-gray-600">
							⋯
						</button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end" className="w-32">
						<DropdownMenuItem onClick={() => onEdit?.()}>
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-red-600"
							onClick={() => onDelete?.()}
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="mt-4">
				<div className="text-sm text-gray-500">Total Saved</div>
				<div className="text-2xl font-semibold mt-2">
					${pot.total.toFixed(2)}
				</div>

				<div className="mt-4">
					<div className="flex items-center justify-between">
						<div className="text-xs text-gray-500">
							{pct.toFixed(1)}%
						</div>
						<div className="text-xs text-gray-500">
							Target of ${pot.target.toFixed(0)}
						</div>
					</div>

					<div className="mt-2 bg-[#f4f1ee] rounded-full h-3 overflow-hidden">
						<div
							className="h-3 rounded-full"
							style={{ width: `${pct}%`, background: pot.theme }}
						/>
					</div>
				</div>

				<div className="mt-4 flex gap-3">
					<Button
						variant="outline"
						className="flex-1"
						onClick={() => onAddMoney?.()}
					>
						+ Add Money
					</Button>
					<Button
						variant="outline"
						className="flex-1"
						onClick={() => onWithdraw?.()}
					>
						Withdraw
					</Button>
				</div>
			</div>
		</div>
	)
}
