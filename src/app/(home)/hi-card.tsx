import { useCenterStore } from '@/hooks/use-center'
import Card from '@/components/card'
import { useState } from 'react'

export const styles = {
	width: 360,
	height: 288,
	order: 1
}

function getGreeting() {
	const hour = new Date().getHours()

	if (hour >= 6 && hour < 12) {
		return 'Good Morning'
	} else if (hour >= 12 && hour < 18) {
		return 'Good Afternoon'
	} else if (hour >= 18 && hour < 22) {
		// return 'Good Evening'
		return 'Good Evening'
	} else {
		return 'Good Night'
	}
}

// 1. 定义一份“圣旨”的格式 (TypeScript 接口)
// 这告诉代码：在这个组件里，name 是一个字符串
interface HiCardProps {
	name: string
}

export default function HiCard({ name }: HiCardProps) {
	const center = useCenterStore()
	// const greeting = getGreeting()
	const [greeting, setGreeting] = useState(getGreeting())

	const toggleGreeting = () => {
		if (greeting == 'Hello~') {
			setGreeting(getGreeting())
		} else {
			setGreeting('Hello~')
		}
	}
	return (
		<Card
			order={styles.order}
			width={styles.width}
			height={styles.height}
			x={center.x}
			y={center.y}
			className='-translate-1/2 text-center max-sm:static max-sm:translate-0'>
			<img src='/images/avatar2.png' className='mx-auto rounded-full' style={{ width: 120, height: 120, boxShadow: ' 0 16px 32px -5px #E2D9CE' }} />
			<h1 className='font-averia mt-3 text-2xl'>
				<span className='inline-block text-red-500 transition-colors duration-500 hover:text-blue-500' onClick={toggleGreeting}>
					{greeting}
				</span>{' '}
				<br /> I'm <span className='text-linear text-[32px]'>{name}</span> , Nice to <br /> meet you!
			</h1>
		</Card>
	)
}
