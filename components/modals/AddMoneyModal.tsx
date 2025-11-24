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

const addSchema = z.object({
	amount: z.number().min(0.01, 'Amount must be greater than 0'),
})

type AddForm = z.infer<typeof addSchema>

export type PotType = {
	name: string
	target: number
	total: number
	theme?: string
} | null

type PropsAddMoney = {
	open: boolean
	onOpenChange: (v: boolean) => void
	pot: PotType
	onConfirm: (amountToAdd: number) => void
}

export default function AddMoneyModal({
	open,
	onOpenChange,
	pot,
	onConfirm,
}: PropsAddMoney) {
	const { register, handleSubmit, watch, reset } = useForm<AddForm>({
		resolver: zodResolver(addSchema),
		defaultValues: { amount: 0 },
	})

	const rawAmount = watch('amount')
	const amount =
		typeof rawAmount === 'number' && !isNaN(rawAmount) ? rawAmount : 0
	const initial = pot?.total ?? 0
	const added = Math.max(0, amount)
	const total = initial + added

	const target = pot?.target || 1

	const initialFill = (initial / target) * 100
	const addedFill = (added / target) * 100
	const emptyFill = Math.max(0, 100 - initialFill - addedFill)

	function onSubmit(values: AddForm) {
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
						<DialogTitle>Add to “{pot?.name}”</DialogTitle>
						<DialogDescription>
							The preview updates as you change the amount.
						</DialogDescription>
					</DialogHeader>
				</div>

				{/* Values Row */}
				<div className="mt-4 flex justify-between items-end">
					<div>
						<div className="text-sm text-gray-600">Current</div>
						<div className="text-lg font-semibold text-black">
							${initial.toFixed(2)}
						</div>
					</div>

					<div>
						<div className="text-sm text-gray-600">To Add</div>
						<div
							className="text-lg font-semibold"
							style={{ color: pot?.theme }}
						>
							+${added.toFixed(2)}
						</div>
					</div>

					<div className="text-right">
						<div className="text-sm text-gray-600">Total</div>
						<div className="text-2xl font-extrabold">
							${total.toFixed(2)}
						</div>
					</div>
				</div>

				{/* Single-bar Preview */}
				<div className="mt-4">
					<div className="w-full h-4 rounded-full flex overflow-hidden">
						<div
							style={{ width: `${initialFill}%`, background: '#000' }}
						/>
						<div
							style={{
								width: `${addedFill}%`,
								background: pot?.theme,
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
						<Label>Amount to Add</Label>
						<Input
							type="number"
							step="0.01"
							{...register('amount', { valueAsNumber: true })}
						/>
					</div>

					<DialogFooter>
						<Button type="submit">Confirm Addition</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
