'use client'

import { useEffect } from 'react'
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
import { THEME_COLORS } from '@/lib/constants'

const schemaEdit = z.object({
	name: z.string().min(1, 'Name required'),
	target: z.number().min(0.01, 'Target must be > 0'),
	total: z.number().min(0, 'Total must be >= 0'),
	theme: z.string().min(1, 'Theme required'),
})

type SchemaEdit = z.infer<typeof schemaEdit>

type PropsEdit = {
	open: boolean
	onOpenChange: (v: boolean) => void
	pot: {
		name: string
		target: number
		total: number
		theme?: string
	} | null
	onEdit: (
		p: {
			name: string
			target: number
			total: number
			theme?: string
		},
		originalName?: string,
	) => void
}

export default function EditPotModal({
	open,
	onOpenChange,
	pot,
	onEdit,
}: PropsEdit) {
	const { register, handleSubmit, control, reset } =
		useForm<SchemaEdit>({
			resolver: zodResolver(schemaEdit),
			defaultValues: { name: '', target: 0, total: 0, theme: '' },
		})

	useEffect(() => {
		if (pot) {
			reset({
				name: pot.name,
				target: pot.target,
				total: pot.total,
				theme: pot.theme ?? '',
			})
		}
	}, [pot, reset])

	function onSubmit(values: SchemaEdit) {
		onEdit(
			{
				name: values.name,
				target: values.target,
				total: values.total,
				theme: values.theme,
			},
			pot?.name,
		)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<div className="flex items-start justify-between">
					<DialogHeader>
						<DialogTitle>Edit Pot</DialogTitle>
						<DialogDescription>
							Update the pot details.
						</DialogDescription>
					</DialogHeader>
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
						<Label>Total</Label>
						<Input
							type="number"
							{...register('total', { valueAsNumber: true })}
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
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{THEME_COLORS.map(t => (
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
						<Button type="submit">Save Changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
