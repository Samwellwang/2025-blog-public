'use client'

import Card from '@/components/card'
import { useCenterStore } from '@/hooks/use-center'
import { styles as hiCardStyles } from './hi-card'
import { CARD_SPACING } from '@/consts'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'

const ART_INDEX_URL = '/images/art/index.json'

export const styles = {
	width: 360,
	height: 200,
	order: 3
}

export default function ArtCard() {
	const center = useCenterStore()
	const [images, setImages] = useState<string[]>(['cat.png', 'sea.png'])
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		fetch(ART_INDEX_URL)
			.then((res) => (res.ok ? res.json() : null))
			.then((list: string[] | null) => {
				if (Array.isArray(list) && list.length > 0) setImages(list)
			})
			.catch(() => {})
	}, [])

	const next = useCallback(() => {
		setCurrentIndex((i) => (i + 1) % images.length)
	}, [images.length])

	return (
		<Card
			className='-translate-1/2 p-2 max-sm:static max-sm:translate-0'
			order={styles.order}
			width={styles.width}
			height={styles.height}
			x={center.x}
			y={center.y - hiCardStyles.height / 2 - styles.height / 2 - CARD_SPACING}>
			<button
				type='button'
				onClick={next}
				className='group relative h-full w-full cursor-pointer overflow-hidden rounded-[32px] focus:outline-none'>
				<AnimatePresence mode='wait'>
					<motion.img
						key={currentIndex}
						src={`/images/art/${images[currentIndex]}`}
						alt='wall art'
						initial={{ opacity: 0, scale: 1.08 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.96 }}
						transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
						className='absolute inset-0 h-full w-full rounded-[32px] object-cover'
					/>
				</AnimatePresence>
				{images.length > 1 && (
					<span className='pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white/90 backdrop-blur-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
						{currentIndex + 1} / {images.length}
					</span>
				)}
			</button>
		</Card>
	)
}
