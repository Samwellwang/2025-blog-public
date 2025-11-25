import { useCenterStore } from '@/hooks/use-center'
import GithubSVG from '@/svgs/github.svg'
import { ANIMATION_DELAY, CARD_SPACING } from '@/consts'
import { styles as hiCardStyles } from './hi-card'
import JuejinSVG from '@/svgs/juejin.svg'
import EmailSVG from '@/svgs/email.svg'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useSize } from '@/hooks/use-size'

export const styles = {
	width: 315,
	height: 48,
	order: 6
}

let delay = 100

export default function SocialButtons() {
	const center = useCenterStore()
	const { maxSM, init } = useSize()
	if (maxSM && init) {
		styles.order = 0
		delay = 0
	}
	const [show, setShow] = useState(false)
	const [secondaryShow, setSecondaryShow] = useState(false)
	const [tertiaryShow, setTertiaryShow] = useState(false)
	useEffect(() => {
		setTimeout(() => setShow(true), styles.order * ANIMATION_DELAY * 1000)
		setTimeout(() => setSecondaryShow(true), styles.order * ANIMATION_DELAY * 1000 + 1 * delay)
		setTimeout(() => setTertiaryShow(true), styles.order * ANIMATION_DELAY * 1000 + 2 * delay)
	}, [])

	if (show)
		return (
			<motion.div
				className='absolute max-sm:static'
				animate={{ left: center.x + hiCardStyles.width / 2, top: center.y + hiCardStyles.height / 2 + CARD_SPACING }}
				initial={{ left: center.x + hiCardStyles.width / 2, top: center.y + hiCardStyles.height / 2 + CARD_SPACING }}>
				<div className='absolute top-0 right-0 flex items-center gap-3 max-sm:static'>
					{tertiaryShow && (
						<motion.a
							href='https://github.com/Samwellwang'
							target='_blank'
							initial={{ opacity: 0, scale: 0.6 }}
							animate={{ opacity: 1, scale: 1 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className='font-averia flex items-center gap-2 rounded-xl border bg-[#070707] px-3 py-2 text-xl text-white'
							style={{ boxShadow: ' inset 0 0 12px rgba(255, 255, 255, 0.4)' }}>
							<GithubSVG />
							Github
						</motion.a>
					)}

					{secondaryShow && (
						<motion.a
							href='https://juejin.cn/user/2427311675422382'
							target='_blank'
							initial={{ opacity: 0, scale: 0.6 }}
							animate={{ opacity: 1, scale: 1 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className='card relative flex items-center gap-2 rounded-xl px-3 py-2.5 font-medium whitespace-nowrap'>
							<JuejinSVG className='h-6 w-6' />
							稀土掘金
						</motion.a>
					)}
					{/*<motion.a*/}
					{/*	href="https://bilibili.com"*/}
					{/*	className="card items-center gap-2 rounded-xl  bg-pink-400 text-white">*/}
					{/*	<span>*/}
					{/*		Bilibili*/}
					{/*	</span>*/}
					{/*</motion.a>*/}
					{/*<motion.a*/}
					{/*	href="https://bilibili.com"*/}
					{/*	target="_blank" // 1. 新标签页打开，防止用户流失*/}

					{/*	// 2. 复制同款动画参数，保持交互一致性*/}
					{/*	initial={{ opacity: 0, scale: 0.6 }}*/}
					{/*	animate={{ opacity: 1, scale: 1 }}*/}
					{/*	whileHover={{ scale: 1.05 }}*/}
					{/*	whileTap={{ scale: 0.95 }}*/}

					{/*	// 3. 完善 Tailwind 样式*/}
					{/*	// flex items-center gap-2: 让图标和文字水平居中对齐，且有间距*/}
					{/*	// rounded-xl: 圆角，这很重要，让它看起来像个按钮而不是矩形块*/}
					{/*	// px-3 py-2: 增加内边距，让文字不要贴着边*/}
					{/*	// font-medium: 加粗一点点，更像按钮*/}
					{/*	className="flex items-center gap-2 rounded-xl bg-pink-400 px-3 py-2 font-medium text-white whitespace-nowrap"*/}
					{/*>*/}
					{/*	/!* 这里暂时复用一下 JuejinSVG，假装它是 B站图标 *!/*/}
					{/*	<JuejinSVG className="h-6 w-6" />*/}
					{/*	<span>B站</span>*/}
					{/*</motion.a>*/}
					<motion.button
						onClick={() => {
							navigator.clipboard.writeText('samwellwang@gmail.com').then(() => {
								toast.success('邮箱已复制到剪贴板')
							})
						}}
						initial={{ opacity: 0, scale: 0.6 }}
						animate={{ opacity: 1, scale: 1 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className='card btn relative rounded-xl p-1.5'>
						<EmailSVG />
					</motion.button>
				</div>
			</motion.div>
		)
	return null
}
