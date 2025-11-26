import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectValue,
	SelectItem,
} from '@/components/ui/select'

import { SortOption } from '@/types'

type Props = {
	value: SortOption
	onChange: (v: SortOption) => void
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
