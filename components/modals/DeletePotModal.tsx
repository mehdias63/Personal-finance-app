'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type PropsDel = {
	open: boolean
	onOpenChange: (v: boolean) => void
	pot: {
		name: string
		target: number
		total: number
		theme?: string
	} | null
	onDelete: () => void
}

export default function DeletePotModal({
	open,
	onOpenChange,
	pot,
	onDelete,
}: PropsDel) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm">
				<div className="flex items-start justify-between">
					<DialogHeader>
						<DialogTitle>Delete “{pot?.name}” Pot?</DialogTitle>
						<DialogDescription>
							This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
				</div>
				<div className="flex justify-end gap-3 mt-6">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={() => {
							onDelete()
							onOpenChange(false)
						}}
					>
						Delete
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
