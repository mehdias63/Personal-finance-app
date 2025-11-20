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
	name: string
	amount: number
	dueDate: string
	paid: boolean
}

export type Data = {
	balance: { current: number; income: number; expenses: number }
	transactions: Transaction[]
	budgets: Budget[]
	pots: Pot[]
	bills?: Bill[]
}
