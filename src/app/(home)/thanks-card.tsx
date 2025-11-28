import { useCenterStore } from '@/hooks/use-center'
import Card from '@/components/card'
import { Heart } from 'lucide-react'
import {styles as calenderPosition} from  '@/app/(home)/calendar-card'
import {styles as musicPositon} from  '@/app/(home)/music-card'
import { CARD_SPACING } from '@/consts'
import {styles as hiCardPosition} from  '@/app/(home)/hi-card'
import clsx from 'clsx'

export const styles = {
	width: 240,
	height: 100,
	offset: 20,
	order: 9
}

export default function ThanksCard() {
	const center = useCenterStore()
	return (
		<Card
			order={styles.order}
			width={styles.width}
			height={styles.height}
			x={center.x+hiCardPosition.width / 2 + CARD_SPACING - styles.offset}
			y={center.y+hiCardPosition.height / 2 + styles.height + musicPositon.height+CARD_SPACING}
			className='flex items-center gap-2'>
			<button className='flex h-12 w-12 items-center justify-center rounded-full bg-linear'>
			<Heart className={clsx('heartbeat','fill-white text-white')} size={30} />
			</button>
			<h1 className='flex flex-col font-averia ml-1 flex-1 '>
				<span className="text-gray-500  hover:text-blue-500 transition-colors duration-500 whitespace-nowrap  ">感谢项目原作者：</span>
				<a className= "text-black-500 text-2xl" href="https://www.yysuni.com/" target="_blank">yysuni</a>
			</h1>
		</Card>
	)
}
