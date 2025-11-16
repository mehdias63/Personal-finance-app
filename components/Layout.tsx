'use client'
import React, { PropsWithChildren } from 'react'
import Sidebar from './Sidebar'

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className="min-h-screen flex bg-[#f6f1ee]">
			<Sidebar />
			<main className="flex-1 p-6 lg:p-10">{children}</main>
		</div>
	)
}
