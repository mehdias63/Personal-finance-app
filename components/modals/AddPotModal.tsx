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
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectValue,
	SelectItem,
} from '@/components/ui/select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'

const schema = z.object({
	name: z.string().min(1, 'Name required'),
	target: z.number().min(0.01, 'Target must be > 0'),
	theme: z.string().min(1, 'Theme required'),
})

type FormValues = z.infer<typeof schema>

const themes = [
	{ label: 'Green', value: '#277C78' },
	{ label: 'Yellow', value: '#F2CD6D' },
	{ label: 'Cyan', value: '#82C9D7' },
	{ label: 'Navy', value: '#0B2545' },
	{ label: 'Red', value: '#E55353' },
	{ label: 'Purple', value: '#826CB0' },
	{ label: 'Turquoise', value: '#40E0D0' },
]

type PropsAdd = {
	open: boolean
	onOpenChange: (v: boolean) => void
	onAdd: (p: {
		name: string
		target: number
		total: number
		theme?: string
	}) => void
}

export default function AddPotModal({
	open,
	onOpenChange,
	onAdd,
}: PropsAdd) {
	const { register, handleSubmit, control, reset } =
		useForm<FormValues>({
			resolver: zodResolver(schema),
			defaultValues: { name: '', target: 0, theme: '' },
		})

	function onSubmit(values: FormValues) {
		onAdd({
			name: values.name,
			target: values.target,
			total: 0,
			theme: values.theme,
		})
		reset()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<div className="flex items-start justify-between">
					<DialogHeader>
						<DialogTitle>Add New Pot</DialogTitle>
						<DialogDescription>
							Add a name, target and theme for this pot.
						</DialogDescription>
					</DialogHeader>
					<button
						aria-label="close"
						className="text-gray-500"
						onClick={() => onOpenChange(false)}
					>
						<X />
					</button>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4 mt-3"
				>
					<div>
						<Label>Name</Label>
						<Input {...register('name')} />
					</div>

					<div>
						<Label>Target</Label>
						<Input
							type="number"
							{...register('target', { valueAsNumber: true })}
						/>
					</div>

					<div>
						<Label>Theme</Label>
						<Controller
							name="theme"
							control={control}
							render={({ field }) => (
								<Select
									onValueChange={v => field.onChange(v)}
									value={field.value}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select theme" />
									</SelectTrigger>
									<SelectContent>
										{themes.map(t => (
											<SelectItem key={t.value} value={t.value}>
												<div className="flex items-center gap-3">
													<span
														className="w-4 h-4 rounded-full"
														style={{ background: t.value }}
													/>
													<span>{t.label}</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<DialogFooter>
						<Button type="submit">Add Pot</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
