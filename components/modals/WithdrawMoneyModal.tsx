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

const withdrawSchema = z.object({
	amount: z
		.number({ invalid_type_error: 'Amount must be a number' })
		.min(0.01, 'Amount must be greater than 0')
		.max(1000000, 'Amount cannot exceed $1,000,000')
		.refine((val) => !isNaN(val) && isFinite(val), {
			message: 'Amount must be a valid number',
		}),
})

type WithdrawForm = z.infer<typeof withdrawSchema>

type PotType = {
	name: string
	target: number
	total: number
	theme?: string
} | null

type PropsWithdraw = {
	open: boolean
	onOpenChange: (v: boolean) => void
	pot: PotType
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

	const rawAmount = watch('amount')
	const amount =
		typeof rawAmount === 'number' && !isNaN(rawAmount) ? rawAmount : 0
	const initial = pot?.total ?? 0
	const withdrawn = Math.max(0, amount)
	const remaining = Math.max(0, initial - withdrawn)

	const target = pot?.target || 1

	const remainingFill = (remaining / target) * 100
	const withdrawnFill = (withdrawn / target) * 100
	const emptyFill = Math.max(0, 100 - remainingFill - withdrawnFill)

	function onSubmit(values: WithdrawForm) {
		if (values.amount > initial) {
			setError('amount', {
				type: 'manual',
				message: 'Cannot withdraw more than current amount.',
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
			onOpenChange={(v: boolean) => onOpenChange(v)}
		>
			<DialogContent className="max-w-lg">
				<div className="flex justify-between items-start">
					<DialogHeader>
						<DialogTitle>Withdraw from “{pot?.name}”</DialogTitle>
						<DialogDescription>
							Preview updates based on withdrawal amount.
						</DialogDescription>
					</DialogHeader>
				</div>

				<div className="mt-4 flex justify-between items-end">
					<div>
						<div className="text-sm text-gray-600">Current</div>
						<div className="text-lg font-semibold text-black">
							${initial.toFixed(2)}
						</div>
					</div>

					<div>
						<div className="text-sm text-gray-600">To Withdraw</div>
						<div className="text-lg font-semibold text-red-600">
							-${withdrawn.toFixed(2)}
						</div>
					</div>

					<div className="text-right">
						<div className="text-sm text-gray-600">Remaining</div>
						<div className="text-2xl font-extrabold">
							${remaining.toFixed(2)}
						</div>
					</div>
				</div>
				<div className="mt-4">
					<div className="w-full h-4 rounded-full flex overflow-hidden">
						<div
							style={{
								width: `${remainingFill}%`,
								background: '#000',
							}}
						/>
						<div
							style={{
								width: `${withdrawnFill}%`,
								background: '#E55353',
							}}
						/>
						<div
							style={{
								width: `${emptyFill}%`,
								background: '#f4f1ee',
							}}
						/>
					</div>

					<div className="text-xs text-gray-600 text-right mt-2">
						Preview
					</div>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-6 space-y-4"
				>
					<div className="space-y-3">
						<Label>Amount to Withdraw</Label>
						<Input
							type="number"
							step="0.01"
							{...register('amount', { valueAsNumber: true })}
						/>
					</div>

					<DialogFooter>
						<Button type="submit">Confirm Withdrawal</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
