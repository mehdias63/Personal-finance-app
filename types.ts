export type Transaction = {
	avatar: string
	name: string
	category: string
	date: string
	amount: number
	recurring: boolean
}

export type Pot = {
	name: string
	target: number
	total: number
	theme: string
}

export type Budget = {
	category: string
	maximum: number
	theme: string
}

export type Bill = {
	id: string
	title: string
	amount: number
	dueLabel: string
	paid: boolean
	category?: string
	date: string
}

export type Data = {
	balance: { current: number; income: number; expenses: number }
	transactions: Transaction[]
	budgets: Budget[]
	pots: Pot[]
	bills?: Bill[]
}

export type SortOption =
	| 'latest'
	| 'oldest'
	| 'az'
	| 'za'
	| 'highest'
	| 'lowest'
