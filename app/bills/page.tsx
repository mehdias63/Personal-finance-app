'use client'

import { useMemo, useState } from 'react'
import dataJson from '@/data/data.json'
import BillsSummaryDetails from '@/components/bills/BillsSummaryDetails'
import BillsList from '@/components/bills/BillsList'
import BillsSearch from '@/components/bills/BillsSearch'
import BillsSort from '@/components/bills/BillsSort'
import { SortOption } from '@/types'
import BillsSummary from '@/components/bills/BillsSummary'

type RawTransaction = {
	avatar?: string
	name: string
	category?: string
	date: string
	amount: number
	recurring?: boolean
}

type Bill = {
	id: string
	title: string
	amount: number
	dueLabel: string
	paid: boolean
	category?: string
	date: string
}

export default function BillsPage() {
	const rawTransactions: RawTransaction[] =
		(dataJson as any).transactions ?? []

	const initialBills: Bill[] = useMemo(() => {
		return rawTransactions
			.filter(t => t.recurring)
			.map((t, i) => {
				const day = new Date(t.date).getUTCDate()
				const suffix = (d: number) => {
					if (d % 10 === 1 && d !== 11) return 'st'
					if (d % 10 === 2 && d !== 12) return 'nd'
					if (d % 10 === 3 && d !== 13) return 'rd'
					return 'th'
				}
				const dueLabel = `Monthly - ${day}${suffix(day)}`

				return {
					id: `${i}-${t.name.replace(/\s+/g, '-').toLowerCase()}`,
					title: t.name,
					amount: Math.abs(t.amount),
					dueLabel,
					paid: false,
					category: t.category,
					date: t.date,
				}
			})
	}, [rawTransactions])

	const [bills] = useState<Bill[]>(initialBills)
	const [query, setQuery] = useState('')
	const [sort, setSort] = useState<SortOption>('latest')

	const visible = useMemo(() => {
		let list = bills.slice()

		if (query.trim() !== '') {
			const q = query.toLowerCase()
			list = list.filter(b => b.title.toLowerCase().includes(q))
		}

		if (sort === 'latest') {
			list.sort(
				(a, b) =>
					new Date(b.date).getTime() - new Date(a.date).getTime(),
			)
		} else if (sort === 'oldest') {
			list.sort(
				(a, b) =>
					new Date(a.date).getTime() - new Date(b.date).getTime(),
			)
		} else if (sort === 'az') {
			list.sort((a, b) => a.title.localeCompare(b.title))
		} else if (sort === 'za') {
			list.sort((a, b) => b.title.localeCompare(a.title))
		} else if (sort === 'highest') {
			list.sort((a, b) => b.amount - a.amount)
		} else if (sort === 'lowest') {
			list.sort((a, b) => a.amount - b.amount)
		}

		return list
	}, [bills, query, sort])

	return (
		<div className="max-w-7xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Recurring Bills</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-1">
					<BillsSummary bills={visible} />
				</div>

				<div className="lg:col-span-2">
					<div className="bg-white rounded-xl p-4 shadow-sm">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div className="flex gap-3 items-center">
								<BillsSearch
									value={query}
									onChange={v => setQuery(v)}
								/>
							</div>
							<div className="flex gap-3 items-center">
								<div className="hidden sm:block text-sm text-gray-600 mr-2">
									Sort by
								</div>
								<BillsSort value={sort} onChange={v => setSort(v)} />
							</div>
						</div>
						<div className="mt-6">
							<BillsList bills={visible} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
