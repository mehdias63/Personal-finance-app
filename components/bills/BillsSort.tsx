import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectValue,
	SelectItem,
} from '@/components/ui/select'

type Props = {
	value: 'latest' | 'oldest' | 'az' | 'za' | 'highest' | 'lowest'
	onChange: (v: Props['value']) => void
}

export default function BillsSort({ value, onChange }: Props) {
	return (
		<Select
			value={value}
			onValueChange={v => onChange(v as Props['value'])}
		>
			<SelectTrigger className="w-44">
				<SelectValue placeholder="Latest" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="latest">Latest</SelectItem>
				<SelectItem value="oldest">Oldest</SelectItem>
				<SelectItem value="az">A to Z</SelectItem>
				<SelectItem value="za">Z to A</SelectItem>
				<SelectItem value="highest">Highest</SelectItem>
				<SelectItem value="lowest">Lowest</SelectItem>
			</SelectContent>
		</Select>
	)
}
