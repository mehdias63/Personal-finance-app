'use client'
import React from 'react'
import Link from 'next/link'
import { Home, List, Wallet, Clock } from 'lucide-react'

export default function Sidebar() {
	return (
		<aside className="w-56 bg-[#242226] text-white min-h-screen p-6 flex flex-col justify-between">
			<div>
				<div className="text-2xl font-bold mb-8">finance</div>
				<nav className="space-y-2">
					<Link
						href="/"
						className="flex items-center gap-3 p-3 rounded-lg bg-[#eef2f3]/0 hover:bg-white/5"
					>
						<Home className="w-4 h-4" /> <span>Overview</span>
					</Link>
					<Link
						href="/transactions"
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5"
					>
						<List className="w-4 h-4" /> <span>Transactions</span>
					</Link>
					<Link
						href="/budgets"
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5"
					>
						<Wallet className="w-4 h-4" /> <span>Budgets</span>
					</Link>
					<Link
						href="/pots"
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5"
					>
						<Clock className="w-4 h-4" /> <span>Pots</span>
					</Link>
					<Link
						href="/bills"
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5"
					>
						<Clock className="w-4 h-4" /> <span>Recurring Bills</span>
					</Link>
				</nav>
			</div>

			<div className="opacity-70 text-sm flex items-center gap-3">
				<span className="transform -rotate-90">◀</span> Minimize Menu
			</div>
		</aside>
	)
}
