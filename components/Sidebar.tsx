'use client'

import Link from 'next/link'
import {
	Home,
	List,
	Wallet,
	NotepadText,
	BadgeDollarSign,
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Sidebar() {
	const [minimized, setMinimized] = useState(false)
	const [isDesktop, setIsDesktop] = useState(true)

	// Detect screen size (desktop vs tablet/mobile)
	useEffect(() => {
		const checkSize = () => {
			setIsDesktop(window.innerWidth >= 1024)
		}
		checkSize()
		window.addEventListener('resize', checkSize)
		return () => window.removeEventListener('resize', checkSize)
	}, [])

	// If screen is NOT desktop → disable minimize
	const canMinimize = isDesktop

	return (
		<>
			{/* DESKTOP SIDEBAR */}
			{isDesktop && (
				<aside
					className={`
            bg-[#242226] text-white min-h-screen flex flex-col justify-between
            transition-all duration-300
            ${minimized ? 'w-20 p-4' : 'w-56 p-6'}
          `}
				>
					<div>
						<div
							className={`
                font-bold mb-8 transition-all 
                ${minimized ? 'text-lg text-center' : 'text-2xl'}
              `}
						>
							finance
						</div>

						<nav className="space-y-2">
							<Link
								href="/"
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5"
							>
								<Home className="w-5 h-5 shrink-0" />
								{!minimized && <span>Overview</span>}
							</Link>

							<Link
								href="/transactions"
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5"
							>
								<List className="w-5 h-5 shrink-0" />
								{!minimized && <span>Transactions</span>}
							</Link>

							<Link
								href="/budgets"
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5"
							>
								<Wallet className="w-5 h-5 shrink-0" />
								{!minimized && <span>Budgets</span>}
							</Link>

							<Link
								href="/pots"
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5"
							>
								<BadgeDollarSign className="w-5 h-5 shrink-0" />
								{!minimized && <span>Pots</span>}
							</Link>

							<Link
								href="/bills"
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5"
							>
								<NotepadText className="w-5 h-5 shrink-0" />
								{!minimized && <span>Recurring Bills</span>}
							</Link>
						</nav>
					</div>

					{/* Minimize Button - only desktop */}
					<button
						onClick={() => canMinimize && setMinimized(!minimized)}
						className="
              opacity-70 text-sm flex items-center gap-3 
              hover:opacity-100 transition-all whitespace-nowrap
            "
					>
						<span
							className={`transform transition-transform ${
								minimized ? 'rotate-90' : '-rotate-90'
							}`}
						>
							◀
						</span>

						<span>{minimized ? '' : 'Minimize Menu'}</span>
					</button>
				</aside>
			)}

			{/* TABLET + MOBILE NAVBAR (BOTTOM) */}
			{!isDesktop && (
				<nav
					className="
            fixed bottom-0 left-0 right-0 z-50 
            bg-[#242226] text-white 
            flex justify-around py-3 border-t border-white/10
          "
				>
					<Link
						href="/"
						className="flex flex-col items-center text-xs"
					>
						<Home className="w-6 h-6" />
						{/* text: show on tablet, hide on mobile */}
						<span className="hidden sm:block">Overview</span>
					</Link>

					<Link
						href="/transactions"
						className="flex flex-col items-center text-xs"
					>
						<List className="w-6 h-6" />
						<span className="hidden sm:block">Transactions</span>
					</Link>

					<Link
						href="/budgets"
						className="flex flex-col items-center text-xs"
					>
						<Wallet className="w-6 h-6" />
						<span className="hidden sm:block">Budgets</span>
					</Link>

					<Link
						href="/pots"
						className="flex flex-col items-center text-xs"
					>
						<BadgeDollarSign className="w-6 h-6" />
						<span className="hidden sm:block">Pots</span>
					</Link>

					<Link
						href="/bills"
						className="flex flex-col items-center text-xs"
					>
						<NotepadText className="w-6 h-6" />
						<span className="hidden sm:block">Bills</span>
					</Link>
				</nav>
			)}
		</>
	)
}
