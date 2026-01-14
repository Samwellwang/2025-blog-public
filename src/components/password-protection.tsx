'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Lock } from 'lucide-react'
import { verifyPassword } from '@/lib/password-utils'
import { toast } from 'sonner'

type PasswordProtectionProps = {
	passwordHash: string
	slug: string
	onUnlock: () => void
}

export function PasswordProtection({ passwordHash, slug, onUnlock }: PasswordProtectionProps) {
	const [password, setPassword] = useState('')
	const [verifying, setVerifying] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!password.trim()) {
			setError('请输入密码')
			return
		}

		setVerifying(true)
		setError(null)

		try {
			const isValid = await verifyPassword(password, passwordHash)
			if (isValid) {
				onUnlock()
				toast.success('密码验证成功')
			} else {
				setError('密码错误，请重试')
				setPassword('')
			}
		} catch (err) {
			console.error('Password verification error:', err)
			setError('验证失败，请重试')
		} finally {
			setVerifying(false)
		}
	}

	return (
		<div className='flex min-h-screen items-center justify-center px-6'>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3 }}
				className='card w-full max-w-md space-y-6 rounded-xl bg-white/80 p-8 text-center'>
				<div className='flex justify-center'>
					<Lock className='h-12 w-12 text-gray-400' />
				</div>
				<div>
					<h2 className='text-xl font-semibold'>此文章受密码保护</h2>
					<p className='text-secondary mt-2 text-sm'>请输入密码以查看文章内容</p>
				</div>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<input
							type='password'
							value={password}
							onChange={e => {
								setPassword(e.target.value)
								setError(null)
							}}
							placeholder='请输入密码'
							className='w-full rounded-lg border bg-white/60 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none'
							disabled={verifying}
							autoFocus
						/>
						{error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
					</div>
					<button
						type='submit'
						disabled={verifying || !password.trim()}
						className='w-full rounded-lg bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50'>
						{verifying ? '验证中...' : '解锁文章'}
					</button>
				</form>
				<p className='text-secondary text-xs'>忘记密码？请联系文章作者</p>
			</motion.div>
		</div>
	)
}
