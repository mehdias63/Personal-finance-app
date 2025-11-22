import StatCard from '@/components/StatCard'
import PotsCard from '@/components/PotsCard'
import BudgetsCard from '@/components/BudgetsCard'
import TransactionsList from '@/components/TransactionsList'
import RecurringBillsCard from '@/components/RecurringBillsCard'

import dataJson from '@/data/data.json'
import { Data, Budget, Pot, Transaction, Bill } from '@/types'

export default function OverviewPage() {
	const data: Data = dataJson as Data
	const transactions: Transaction[] = data.transactions.slice(0, 5)
	const pots: Pot[] = data.pots
	const budgets: Budget[] = data.budgets

	return (
		<div className="max-w-7xl mx-auto">
			<h2 className="text-2xl font-bold mb-6">Overview</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<StatCard
					title="Current Balance"
					value={`$4,836.00`}
					variant="primary"
				/>
				<StatCard title="Income" value={`$3,814.25`} />
				<StatCard title="Expenses" value={`$1,700.50`} />
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
					<RecurringBillsCard transactions={data.transactions} />
				</div>
			</div>
		</div>
	)
}
