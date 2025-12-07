'use client'

import { useEffect, useMemo, useState } from 'react'
import dataJson from '@/data/data.json'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { THEME_COLORS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import styles from './page.module.css'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectValue,
	SelectItem,
} from '@/components/ui/select'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from '@/components/ui/avatar'
import { X } from 'lucide-react'

type Budget = {
	category: string
	maximum: number
	theme?: string
}

type Transaction = {
	avatar?: string
	name?: string
	category?: string
	date?: string
	amount: number
	recurring?: boolean
}

// zod schema for add/edit forms
const budgetSchema = z.object({
	category: z.string().min(1, 'Category is required'),
	maximum: z.number().min(1, 'Maximum must be > 0'),
	theme: z.string().min(1, 'Theme is required'),
})

type FormValues = {
	category: string
	maximum: number
	theme: string
}

export default function BudgetsPage() {
	// load initial data from data.json
	const data = dataJson as { budgets?: Budget[]; transactions?: Transaction[] }
	const initialBudgets: Budget[] = data.budgets ?? []
	const transactions: Transaction[] = data.transactions ?? []

	// local state (start from data.json but allow local edits)
	const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)

	// modal state
	const [addOpen, setAddOpen] = useState(false)
	const [editOpen, setEditOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [selectedBudget, setSelectedBudget] = useState<Budget | null>(
		null,
	)

	// item being edited / deleted
	const [activeBudget, setActiveBudget] = useState<Budget | null>(
		null,
	)

	// derived budgets with spent calculation
	const budgetsWithSpent = useMemo(() => {
		return budgets.map(b => {
			const spent = transactions
				.filter(t => t.category === b.category && t.amount < 0)
				.reduce((s, t) => s + Math.abs(t.amount), 0)
			return { ...b, spent }
		})
	}, [budgets, transactions])

	const totalMax = Math.max(
		1,
		budgets.reduce((s, b) => s + (b.maximum || 0), 0),
	)
	let acc = 0
	const donutStops = budgets.map(b => {
		const pct = (b.maximum / totalMax) * 100
		const start = acc
		const end = acc + pct
		acc = end
		return `${b.theme ?? '#ddd'} ${start}% ${end}%`
	})
	const donutGradient = donutStops.length
		? `conic-gradient(${donutStops.join(', ')})`
		: 'transparent'

	const totalSpent = budgetsWithSpent.reduce(
		(s, b) => s + (b.spent ?? 0),
		0,
	)

	// ----------------- Add Form (react-hook-form + zod) -----------------
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors: addErrors, isSubmitting: isAdding },
	} = useForm<FormValues>({
		resolver: zodResolver(budgetSchema),
		defaultValues: {
			category: '',
			maximum: 0,
			theme: '',
		},
	})

	function onAdd(values: FormValues) {
		const exists = budgets.some(b => b.category === values.category)
		const newBudget: Budget = {
			category: values.category,
			maximum: Number(values.maximum),
			theme: values.theme,
		}
		if (exists) {
			// if same category exists, replace it
			setBudgets(prev =>
				prev.map(p =>
					p.category === newBudget.category ? newBudget : p,
				),
			)
		} else {
			setBudgets(prev => [...prev, newBudget])
		}
		reset()
		setAddOpen(false)
	}

	// ----------------- Edit Form -----------------
	const {
		register: editRegister,
		handleSubmit: handleSubmitEdit,
		control: editControl,
		reset: resetEdit,
		formState: { errors: editErrors, isSubmitting: isEditing },
	} = useForm<FormValues>({
		resolver: zodResolver(budgetSchema),
		defaultValues: {
			category: '',
			maximum: 0,
			theme: '',
		},
	})

	useEffect(() => {
		if (activeBudget && editOpen) {
			resetEdit({
				category: activeBudget.category,
				maximum: activeBudget.maximum,
				theme: activeBudget.theme ?? '',
			})
		}
	}, [activeBudget, editOpen, resetEdit])

	function onEdit(values: FormValues) {
		const edited: Budget = {
			category: values.category,
			maximum: Number(values.maximum),
			theme: values.theme,
		}
		setBudgets(prev =>
			prev.map(b =>
				b.category === activeBudget?.category ? edited : b,
			),
		)
		setEditOpen(false)
		setActiveBudget(null)
	}

	// ----------------- Delete -----------------
	function onDeleteConfirm() {
		if (!activeBudget) return
		setBudgets(prev =>
			prev.filter(b => b.category !== activeBudget.category),
		)
		setDeleteOpen(false)
		setActiveBudget(null)
	}

	// helper: latest 3 transactions for a category
	function latestTransactionsFor(category: string) {
		return transactions
			.filter(t => t.category === category)
			.sort((a, b) => {
				const da = a.date ? new Date(a.date).getTime() : 0
				const db = b.date ? new Date(b.date).getTime() : 0
				return db - da
			})
			.slice(0, 3)
	}

	// ----------------- UI -----------------
	return (
		<div className="max-w-7xl mx-auto p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Budgets</h1>
				<div className="flex items-center gap-3">
					<Button onClick={() => setAddOpen(true)}>
						+ Add New Budget
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left: Donut & summary */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0ebe7]">
					<div className="flex items-center gap-6">
						<div
							className={styles.donutChart}
							style={{ '--donut-gradient': donutGradient } as React.CSSProperties}
						/>
						<div>
							<div className="text-2xl font-extrabold">
								${totalSpent.toFixed(0)}
							</div>
							<div className="text-xs text-gray-500 mt-1">
								of ${totalMax.toFixed(0)} limit
							</div>
						</div>
					</div>

					<div className="mt-6">
						<h4 className="text-sm font-medium mb-2">
							Spending Summary
						</h4>
						<ul className="space-y-3">
							{budgetsWithSpent.map((b, i) => (
								<li
									key={i}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-3">
										<span
											className={styles.themeBar}
											style={{ '--bar-color': b.theme } as React.CSSProperties}
										/>
										<div>
											<div className="text-sm">{b.category}</div>
											<div className="text-xs text-gray-500">
												${formatCurrency(b.spent)} of $
												{formatCurrency(b.maximum)}
											</div>
										</div>
									</div>
									<div className="text-sm font-medium">
										${formatCurrency(b.maximum)}
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Right: list of budget cards */}
				<div className="lg:col-span-2 space-y-6">
					{budgetsWithSpent.map((b, idx) => {
						const pct = b.maximum
							? Math.round((b.spent / b.maximum) * 100)
							: 0
						const remaining = Math.max(0, b.maximum - (b.spent ?? 0))
						const latest = latestTransactionsFor(b.category)

						return (
							<div
								key={b.category}
								className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0ebe7]"
							>
								<div className="flex items-start justify-between">
									<div>
										<div className="flex items-center gap-3">
											<span
												className={styles.themeIndicator}
												style={{ '--indicator-color': b.theme } as React.CSSProperties}
											/>
											<div className="text-sm font-medium">
												{b.category}
											</div>
										</div>
										<div className="text-xs text-gray-500">
											Maximum of ${formatCurrency(b.maximum)}
										</div>
									</div>

									<div className="flex items-center gap-3">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<button className="text-gray-400 hover:text-gray-600">
													⋯
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-36"
											>
												<DropdownMenuItem
													onClick={() => {
														setActiveBudget(b)
														setEditOpen(true)
													}}
												>
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-red-600"
													onClick={() => {
														setSelectedBudget(b)
														setDeleteOpen(true)
													}}
												>
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>

								{/* progress bar */}
								<div className="mt-4">
									<div className="bg-[#f4f1ee] rounded-full h-3 overflow-hidden">
										<div
											className={styles.progressBar}
											style={{
												'--progress-width': `${Math.min(100, pct)}%`,
												'--progress-color': b.theme,
											} as React.CSSProperties}
										/>
									</div>
									<div className="flex items-center justify-between mt-3">
										<div className="text-xs text-gray-500">Spent</div>
										<div className="text-xs text-gray-500">
											Remaining
										</div>
									</div>
									<div className="flex items-center justify-between mt-1">
										<div className="text-sm font-semibold">
											${formatCurrency(b.spent)}
										</div>
										<div className="text-sm font-semibold">
											${formatCurrency(remaining)}
										</div>
									</div>
								</div>

								{/* Latest spending */}
								<div className="mt-4 bg-[#f9f7f5] p-3 rounded-lg">
									<div className="flex items-center justify-between mb-3">
										<div className="text-sm font-medium">
											Latest Spending
										</div>
										<div className="text-xs text-gray-500">
											See All ▸
										</div>
									</div>

									<ul className="space-y-3">
										{latest.map((t, i) => (
											<li
												key={i}
												className="flex items-center justify-between"
											>
												<div className="flex items-center gap-3">
													<Avatar className="h-8 w-8">
														<AvatarImage src={t.avatar} alt={t.name || 'Transaction'} />
														<AvatarFallback>
															{t.name?.[0]?.toUpperCase() || 'T'}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="text-sm font-medium">
															{t.name}
														</div>
														<div className="text-xs text-gray-500">
															{t.date
																? new Date(t.date).toLocaleDateString(
																		'en-GB',
																		{
																			day: '2-digit',
																			month: 'short',
																			year: 'numeric',
																		},
																  )
																: ''}
														</div>
													</div>
												</div>
												<div
													className={`font-semibold ${
														t.amount < 0 ? '' : 'text-emerald-600'
													}`}
												>
													{t.amount < 0
														? `-$${formatCurrency(Math.abs(t.amount))}`
														: `+$${formatCurrency(t.amount)}`}
												</div>
											</li>
										))}
										{latest.length === 0 && (
											<li className="text-sm text-gray-500">
												No transactions
											</li>
										)}
									</ul>
								</div>
							</div>
						)
					})}
				</div>
			</div>

			{/* ================= ADD DIALOG ================= */}
			<Dialog open={addOpen} onOpenChange={setAddOpen}>
				<DialogContent className="max-w-md">
					<div className="flex items-start justify-between">
						<DialogHeader>
							<DialogTitle>Add New Budget</DialogTitle>
							<DialogDescription>
								Add a category, maximum spend and theme color.
							</DialogDescription>
						</DialogHeader>
					</div>

					<form
						onSubmit={handleSubmit(onAdd)}
						className="space-y-4 mt-3"
					>
						<div>
							<Label>Budget Category</Label>
							<Controller
								name="category"
								control={control}
								render={({ field }) => (
									<Select
										onValueChange={v => field.onChange(v)}
										value={field.value}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Entertainment">
												Entertainment
											</SelectItem>
											<SelectItem value="Bills">Bills</SelectItem>
											<SelectItem value="Dining Out">
												Dining Out
											</SelectItem>
											<SelectItem value="Groceries">
												Groceries
											</SelectItem>
											<SelectItem value="Personal Care">
												Personal Care
											</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{addErrors?.category && (
								<p className="text-xs text-red-600 mt-1">
									{addErrors.category.message}
								</p>
							)}
						</div>

						<div>
							<Label>Maximum Spend</Label>
							<Input
								type="number"
								{...register('maximum', { valueAsNumber: true })}
								placeholder="e.g. 200"
							/>
							{addErrors?.maximum && (
								<p className="text-xs text-red-600 mt-1">
									{addErrors.maximum.message}
								</p>
							)}
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
											<SelectValue placeholder="Pick a theme color" />
										</SelectTrigger>
										<SelectContent>
											{THEME_COLORS.map(t => (
												<SelectItem key={t.value} value={t.value}>
													<div className="flex items-center gap-3">
														<span
															className={styles.colorSwatch}
															style={{ '--swatch-color': t.value } as React.CSSProperties}
														/>
														<span>{t.label}</span>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							{addErrors?.theme && (
								<p className="text-xs text-red-600 mt-1">
									{addErrors.theme.message}
								</p>
							)}
						</div>

						<DialogFooter>
							<Button type="submit" disabled={isAdding}>
								Add Budget
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* ================= EDIT DIALOG ================= */}
			<Dialog
				open={editOpen}
				onOpenChange={() => {
					setEditOpen(false)
					setActiveBudget(null)
				}}
			>
				<DialogContent className="max-w-md">
					<div className="flex items-start justify-between">
						<DialogHeader>
							<DialogTitle>Edit Budget</DialogTitle>
							<DialogDescription>
								Update the budget values.
							</DialogDescription>
						</DialogHeader>
					</div>

					{activeBudget && (
						<form
							onSubmit={handleSubmitEdit(onEdit)}
							className="space-y-4 mt-3"
						>
							<div>
								<Label>Budget Category</Label>
								<Controller
									name="category"
									control={editControl}
									render={({ field }) => (
										<Select
											onValueChange={v => field.onChange(v)}
											value={field.value}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Entertainment">
													Entertainment
												</SelectItem>
												<SelectItem value="Bills">Bills</SelectItem>
												<SelectItem value="Dining Out">
													Dining Out
												</SelectItem>
												<SelectItem value="Groceries">
													Groceries
												</SelectItem>
												<SelectItem value="Personal Care">
													Personal Care
												</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
								{editErrors?.category && (
									<p className="text-xs text-red-600 mt-1">
										{editErrors.category.message}
									</p>
								)}
							</div>

							<div>
								<Label>Maximum Spend</Label>
								<Input
									type="number"
									{...editRegister('maximum', {
										valueAsNumber: true,
									})}
								/>
								{editErrors?.maximum && (
									<p className="text-xs text-red-600 mt-1">
										{editErrors.maximum.message}
									</p>
								)}
							</div>

							<div>
								<Label>Theme</Label>
								<Controller
									name="theme"
									control={editControl}
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
																className={styles.colorSwatch}
																style={{ '--swatch-color': t.value } as React.CSSProperties}
															/>
															<span>{t.label}</span>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								{editErrors?.theme && (
									<p className="text-xs text-red-600 mt-1">
										{editErrors.theme.message}
									</p>
								)}
							</div>

							<DialogFooter>
								<Button type="submit" disabled={isEditing}>
									Save Changes
								</Button>
							</DialogFooter>
						</form>
					)}
				</DialogContent>
			</Dialog>

			{/* ================= DELETE DIALOG ================= */}
			<Dialog
				open={deleteOpen}
				onOpenChange={() => {
					setDeleteOpen(false)
					setActiveBudget(null)
				}}
			>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>
							Delete “{selectedBudget?.category}”
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this budget? This action
							cannot be reversed, and all the data inside it will be
							removed forever.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-3 flex flex-col mt-4">
						<Button variant="destructive" onClick={onDeleteConfirm}>
							Yes, Confirm Deletion
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								setDeleteOpen(false)
								setActiveBudget(null)
							}}
						>
							No, Go Back
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
