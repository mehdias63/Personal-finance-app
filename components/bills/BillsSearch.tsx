import { Input } from '@/components/ui/input'

type Props = {
	value: string
	onChange: (v: string) => void
}

export default function BillsSearch({ value, onChange }: Props) {
	return (
		<div className="w-full max-w-sm">
			<Input
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder="Search bills"
				className="w-full"
			/>
		</div>
	)
}
