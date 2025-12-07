import StatCard from '@/components/StatCard'
import PotsCard from '@/components/PotsCard'
import BudgetsCard from '@/components/BudgetsCard'
import TransactionsList from '@/components/TransactionsList'
import dataJson from '@/data/data.json'
import { Data, Budget, Pot, Transaction, Bill } from '@/types'
import BillsSummaryDetails from '@/components/bills/BillsSummaryDetails'

export default function OverviewPage() {
	const data: Data = dataJson as Data
	const transactions: Transaction[] = data.transactions.slice(0, 5)
	const pots: Pot[] = data.pots
	const budgets: Budget[] = data.budgets

	const bills: Bill[] = data.transactions
		.filter(t => t.recurring)
		.map((t, i) => {
			const day = new Date(t.date).getUTCDate()
			const suffix = (d: number) => {
				if (d % 10 === 1 && d !== 11) return 'st'
				if (d % 10 === 2 && d !== 12) return 'nd'
				if (d % 10 === 3 && d !== 13) return 'rd'
				return 'th'
			}

			return {
				id: `${i}-${t.name.replace(/\s+/g, '-').toLowerCase()}`,
				title: t.name,
				amount: Math.abs(t.amount),
				dueLabel: `Monthly - ${day}${suffix(day)}`,
				paid: false,
				category: t.category,
				date: t.date,
			}
		})

	return (
		<div className="max-w-7xl mx-auto">
			<h2 className="text-2xl font-bold mb-6">Overview</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<StatCard
					title="Current Balance"
					value={`$${data.balance.current.toFixed(2)}`}
					variant="primary"
				/>
				<StatCard title="Income" value={`$${data.balance.income.toFixed(2)}`} />
				<StatCard title="Expenses" value={`$${data.balance.expenses.toFixed(2)}`} />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<PotsCard pots={pots} />
					<TransactionsList transactions={transactions} />
				</div>
				<div className="space-y-6">
					<BudgetsCard
						budgets={budgets}
						transactions={data.transactions}
					/>
					<BillsSummaryDetails bills={bills} />
				</div>
			</div>
		</div>
	)
}
