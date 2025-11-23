'use client'

import React from 'react'
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

const addSchema = z.object({
	amount: z.number().min(0.01, 'Amount must be greater than 0'),
})

type AddForm = z.infer<typeof addSchema>

type PotType = {
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

	const amount = Number(watch('amount') ?? 0)
	const initial = pot?.total ?? 0
	const added = Math.max(0, amount)
	const total = initial + added

	// segments sum = initial + added (no gap)
	const segTotal = initial + added || 1
	const initialWidth = (initial / segTotal) * 100
	const addedWidth = (added / segTotal) * 100

	function onSubmit(values: AddForm) {
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
			<div className="flex justify-end">
				<DialogContent className="max-w-lg ml-4">
					<div className="flex items-start justify-between">
						<DialogHeader>
							<DialogTitle>Add to “{pot?.name}”</DialogTitle>
							<DialogDescription>
								Add money to this pot. The preview updates as you
								change the amount.
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
								<div className="text-sm text-gray-600">To Add</div>
								<div
									className="text-lg font-medium"
									style={{ color: pot?.theme ?? '#10b981' }}
								>
									+${added.toFixed(2)}
								</div>
							</div>

							<div className="text-right">
								<div className="text-sm text-gray-600">Total</div>
								<div className="text-2xl font-extrabold text-gray-800">
									${total.toFixed(2)}
								</div>
							</div>
						</div>

						{/* single bar with two glued segments */}
						<div className="mt-4">
							<div className="w-full h-4 rounded-full overflow-hidden bg-[#f4f1ee] flex">
								<div
									style={{
										width: `${initialWidth}%`,
										background: '#000000',
									}}
								/>
								<div
									style={{
										width: `${addedWidth}%`,
										background: pot?.theme ?? '#277C78',
									}}
								/>
							</div>
							<div className="mt-2 flex items-center justify-between text-xs text-gray-500">
								<div>{((initial / segTotal) * 100).toFixed(2)}%</div>
								<div>Preview</div>
							</div>
						</div>

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="mt-6 space-y-4"
						>
							<div>
								<Label>Amount to Add</Label>
								<div className="mt-2">
									<Input
										type="number"
										step="0.01"
										{...register('amount', { valueAsNumber: true })}
										placeholder="e.g. 100"
									/>
								</div>
							</div>

							<DialogFooter>
								<Button type="submit">Confirm Addition</Button>
							</DialogFooter>
						</form>
					</div>
				</DialogContent>
			</div>
		</Dialog>
	)
}
