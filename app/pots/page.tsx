'use client'

import { useMemo, useState } from 'react'
import dataJson from '@/data/data.json'
import PotCard from '@/components/PotCard'
import AddPotModal from '@/components/modals/AddPotModal'
import EditPotModal from '@/components/modals/EditPotModal'
import DeletePotModal from '@/components/modals/DeletePotModal'
import AddMoneyModal from '@/components/modals/AddMoneyModal'
import WithdrawMoneyModal from '@/components/modals/WithdrawMoneyModal'

import { Button } from '@/components/ui/button'

type Pot = {
	name: string
	target: number
	total: number
	theme?: string
}

export default function PotsPage() {
	const initialPots: Pot[] = (dataJson as any).pots ?? []

	const [pots, setPots] = useState<Pot[]>(initialPots)

	const [addOpen, setAddOpen] = useState(false)
	const [editOpen, setEditOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)

	const [addMoneyOpen, setAddMoneyOpen] = useState(false)
	const [withdrawOpen, setWithdrawOpen] = useState(false)

	const [active, setActive] = useState<Pot | null>(null)

	const totalSaved = useMemo(
		() => pots.reduce((s, p) => s + (p.total ?? 0), 0),
		[pots],
	)

	function handleAdd(p: Pot) {
		setPots(prev => [...prev, p])
	}

	function handleEdit(updated: Pot, originalName?: string) {
		setPots(prev =>
			prev.map(p =>
				p.name === (originalName ?? updated.name) ? updated : p,
			),
		)
	}

	function handleDelete(name: string) {
		setPots(prev => prev.filter(p => p.name !== name))
	}

	function handleConfirmAddMoney(amount: number) {
		if (!active) return
		setPots(prev =>
			prev.map(p =>
				p.name === active.name
					? { ...p, total: +(p.total + amount) }
					: p,
			),
		)
	}

	function handleConfirmWithdraw(amount: number) {
		if (!active) return
		setPots(prev =>
			prev.map(p =>
				p.name === active.name
					? { ...p, total: +Math.max(0, p.total - amount) }
					: p,
			),
		)
	}

	return (
		<div className="max-w-6xl mx-auto p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Pots</h1>
				<div className="flex items-center gap-3">
					<div className="text-sm text-gray-600">Total saved</div>
					<div className="text-lg font-semibold">
						${totalSaved.toFixed(2)}
					</div>
					<Button onClick={() => setAddOpen(true)}>
						+ Add New Pot
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{pots.map(pot => (
					<PotCard
						key={pot.name}
						pot={pot}
						onEdit={() => {
							setActive(pot)
							setEditOpen(true)
						}}
						onDelete={() => {
							setActive(pot)
							setDeleteOpen(true)
						}}
						onAddMoney={() => {
							setActive(pot)
							setAddMoneyOpen(true)
						}}
						onWithdraw={() => {
							setActive(pot)
							setWithdrawOpen(true)
						}}
					/>
				))}
			</div>
			<AddPotModal
				open={addOpen}
				onOpenChange={setAddOpen}
				onAdd={p => handleAdd(p)}
			/>
			<EditPotModal
				open={editOpen}
				onOpenChange={v => {
					setEditOpen(v)
					if (!v) setActive(null)
				}}
				pot={active}
				onEdit={updated => handleEdit(updated, active?.name)}
			/>
			<DeletePotModal
				open={deleteOpen}
				onOpenChange={v => {
					setDeleteOpen(v)
					if (!v) setActive(null)
				}}
				pot={active}
				onDelete={() => {
					if (active) {
						handleDelete(active.name)
						setDeleteOpen(false)
						setActive(null)
					}
				}}
			/>
			<AddMoneyModal
				open={addMoneyOpen}
				onOpenChange={v => {
					setAddMoneyOpen(v)
					if (!v) setActive(null)
				}}
				pot={active}
				onConfirm={amt => {
					handleConfirmAddMoney(amt)
				}}
			/>
			<WithdrawMoneyModal
				open={withdrawOpen}
				onOpenChange={v => {
					setWithdrawOpen(v)
					if (!v) setActive(null)
				}}
				pot={active}
				onConfirm={amt => {
					handleConfirmWithdraw(amt)
				}}
			/>
		</div>
	)
}
