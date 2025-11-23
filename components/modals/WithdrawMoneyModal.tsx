'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'

const withdrawSchema = z.object({
	amount: z.number().min(0.01, 'Amount must be greater than 0'),
})

type WithdrawForm = z.infer<typeof withdrawSchema>

type PropsWithdraw = {
	open: boolean
	onOpenChange: (v: boolean) => void
	pot: {
		name: string
		target: number
		total: number
		theme?: string
	} | null
	onConfirm: (amountToWithdraw: number) => void
}

export default function WithdrawMoneyModal({
	open,
	onOpenChange,
	pot,
	onConfirm,
}: PropsWithdraw) {
	const { register, handleSubmit, watch, reset, setError } =
		useForm<WithdrawForm>({
			resolver: zodResolver(withdrawSchema),
			defaultValues: { amount: 0 },
		})

	const amount = Number(watch('amount') ?? 0)
	const initial = pot?.total ?? 0
	const withdrawn = Math.max(0, amount)
	const remaining = Math.max(0, initial - withdrawn)

	// segTotal = initial (remaining + withdrawn = initial)
	const segTotal = initial || 1
	const remainingWidth = (remaining / segTotal) * 100
	const withdrawnWidth = (withdrawn / segTotal) * 100

	function onSubmit(values: WithdrawForm) {
		if (values.amount > initial) {
			setError('amount', {
				type: 'manual',
				message: 'Cannot withdraw more than current total.',
			})
			return
		}
		onConfirm(values.amount)
		reset()
		onOpenChange(false)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={v => {
				if (!v) {
					reset()
					onOpenChange(false)
				} else onOpenChange(true)
			}}
		>
			<div className="flex justify-start">
				<DialogContent className="max-w-lg mr-4">
					<div className="flex items-start justify-between">
						<DialogHeader>
							<DialogTitle>Withdraw from “{pot?.name}”</DialogTitle>
							<DialogDescription>
								Withdraw money from this pot. Preview shows resulting
								progress.
							</DialogDescription>
						</DialogHeader>
						<button
							aria-label="close"
							onClick={() => {
								reset()
								onOpenChange(false)
							}}
							className="text-gray-500 hover:text-gray-700"
						>
							<X />
						</button>
					</div>

					<div className="mt-4">
						{/* values row */}
						<div className="flex justify-between items-end gap-3">
							<div>
								<div className="text-sm text-gray-600">Current</div>
								<div className="text-lg font-medium text-black">
									${initial.toFixed(2)}
								</div>
							</div>

							<div>
								<div className="text-sm text-gray-600">
									To Withdraw
								</div>
								<div className="text-lg font-medium text-red-600">
									-${withdrawn.toFixed(2)}
								</div>
							</div>

							<div className="text-right">
								<div className="text-sm text-gray-600">Remaining</div>
								<div className="text-2xl font-extrabold text-gray-800">
									${remaining.toFixed(2)}
								</div>
							</div>
						</div>

						{/* single glued bar */}
						<div className="mt-4">
							<div className="w-full h-4 rounded-full overflow-hidden bg-[#f4f1ee] flex">
								<div
									style={{
										width: `${remainingWidth}%`,
										background: '#000000',
									}}
								/>
								<div
									style={{
										width: `${withdrawnWidth}%`,
										background: '#E55353',
									}}
								/>
							</div>
							<div className="mt-2 flex items-center justify-between text-xs text-gray-500">
								<div>
									{((remaining / segTotal) * 100).toFixed(2)}%
								</div>
								<div>Preview</div>
							</div>
						</div>

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="mt-6 space-y-4"
						>
							<div>
								<Label>Amount to Withdraw</Label>
								<div className="mt-2">
									<Input
										type="number"
										step="0.01"
										{...register('amount', { valueAsNumber: true })}
										placeholder="e.g. 50"
									/>
								</div>
								{/* show form error if any */}
								<p className="text-sm text-red-600 mt-1">
									{/* react-hook-form will populate error via setError */}
								</p>
							</div>

							<DialogFooter>
								<Button type="submit">Confirm Withdrawal</Button>
							</DialogFooter>
						</form>
					</div>
				</DialogContent>
			</div>
		</Dialog>
	)
}
