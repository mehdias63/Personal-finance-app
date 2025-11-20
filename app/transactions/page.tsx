'use client'

import { useState, useMemo } from 'react'
import data from '@/data/data.json'
import { Transaction } from '@/types'

import { Input } from '@/components/ui/input'

import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectValue,
	SelectItem,
} from '@/components/ui/select'

import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table'

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
} from '@/components/ui/pagination'

import { Button } from '@/components/ui/button'

import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from '@/components/ui/avatar'

export default function TransactionsPage() {
	const allTransactions: Transaction[] = data.transactions

	const [search, setSearch] = useState('')
	const [sort, setSort] = useState('latest')
	const [category, setCategory] = useState('all')
	const [page, setPage] = useState(1)
	const perPage = 10

	const filteredTransactions = useMemo(() => {
		let t = [...allTransactions]

		if (search.trim() !== '') {
			const s = search.toLowerCase()
			t = t.filter(tr => tr.name.toLowerCase().includes(s))
		}

		if (category !== 'all') {
			t = t.filter(tr => tr.category === category)
		}

		if (sort === 'latest') {
			t.sort(
				(a, b) =>
					new Date(b.date).getTime() - new Date(a.date).getTime(),
			)
		}

		if (sort === 'oldest') {
			t.sort(
				(a, b) =>
					new Date(a.date).getTime() - new Date(b.date).getTime(),
			)
		}

		if (sort === 'az') {
			t.sort((a, b) => a.name.localeCompare(b.name))
		}

		if (sort === 'za') {
			t.sort((a, b) => b.name.localeCompare(a.name))
		}

		if (sort === 'highest') {
			t.sort((a, b) => b.amount - a.amount)
		}

		if (sort === 'lowest') {
			t.sort((a, b) => a.amount - b.amount)
		}

		return t
	}, [search, sort, category])

	const totalPages = Math.ceil(filteredTransactions.length / perPage)
	const paginated = filteredTransactions.slice(
		(page - 1) * perPage,
		page * perPage,
	)

	return (
		<div className="p-6 max-w-7xl mx-auto min-h-screen flex flex-col">
			<h2 className="text-3xl font-bold mb-6">Transactions</h2>
			<div className="p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-center justify-between">
				<Input
					placeholder="Search transaction"
					value={search}
					onChange={e => {
						setSearch(e.target.value)
						setPage(1)
					}}
					className="w-[250px]"
				/>
				<Select
					value={sort}
					onValueChange={v => {
						setSort(v)
						setPage(1)
					}}
				>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="latest">Latest</SelectItem>
						<SelectItem value="oldest">Oldest</SelectItem>
						<SelectItem value="az">A to Z</SelectItem>
						<SelectItem value="za">Z to A</SelectItem>
						<SelectItem value="highest">Highest Amount</SelectItem>
						<SelectItem value="lowest">Lowest Amount</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={category}
					onValueChange={v => {
						setCategory(v)
						setPage(1)
					}}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Transactions</SelectItem>
						<SelectItem value="Entertainment">
							Entertainment
						</SelectItem>
						<SelectItem value="Bills">Bills</SelectItem>
						<SelectItem value="Groceries">Groceries</SelectItem>
						<SelectItem value="Dining Out">Dining Out</SelectItem>
						<SelectItem value="Transportation">
							Transportation
						</SelectItem>
						<SelectItem value="Personal Care">
							Personal Care
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Recipient / Sender</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>Transaction Date</TableHead>
						<TableHead className="text-right">Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{paginated.map((tr, i) => (
						<TableRow key={tr.name ?? i}>
							<TableCell>
								<div className="flex items-center gap-3">
									<Avatar>
										<AvatarImage src={tr.avatar} alt={tr.name} />
										<AvatarFallback>{tr.name[0]}</AvatarFallback>
									</Avatar>
									<span className="font-medium">{tr.name}</span>
								</div>
							</TableCell>
							<TableCell>{tr.category}</TableCell>
							<TableCell>
								{new Date(tr.date).toLocaleDateString('en-US', {
									day: '2-digit',
									month: 'short',
									year: 'numeric',
								})}
							</TableCell>
							<TableCell className="text-right font-semibold">
								<span
									className={tr.amount >= 0 ? 'text-green-600' : ''}
								>
									{tr.amount >= 0
										? `+$${tr.amount.toFixed(2)}`
										: `-$${Math.abs(tr.amount).toFixed(2)}`}
								</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="mt-auto py-6">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => page > 1 && setPage(page - 1)}
								className="cursor-pointer"
							/>
						</PaginationItem>
						{Array.from({ length: totalPages }).map((_, i) => (
							<PaginationItem key={i}>
								<Button
									variant={page === i + 1 ? 'default' : 'outline'}
									onClick={() => setPage(i + 1)}
									className="w-10"
								>
									{i + 1}
								</Button>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								onClick={() => page < totalPages && setPage(page + 1)}
								className="cursor-pointer"
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	)
}
