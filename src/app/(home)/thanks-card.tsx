import { useCenterStore } from '@/hooks/use-center'
import Card from '@/components/card'
import {styles as calenderPosition} from  '@/app/(home)/calendar-card'
import {styles as musicPositon} from  '@/app/(home)/music-card'
import { CARD_SPACING } from '@/consts'
import {styles as hiCardPosition} from  '@/app/(home)/hi-card'

export const styles = {
	width: 300,
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
			className='text-center max-sm:static max-sm:translate-0'>
			<h1 className='font-averia mt-3 text-2xl'>
				<span className="text-gray-500  hover:text-blue-500 transition-colors duration-500 inline-block whitespace-nowrap  ">感谢原项目作者： <a href="https://www.yysuni.com/" target="_blank">yysuni</a> </span>
			</h1>
		</Card>
	)
}
