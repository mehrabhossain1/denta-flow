'use client'

import { createBillingPortalSession } from '@/lib/billing/server'
import { useState } from 'react'
import { Button } from '../ui/button'

type PropTypes = {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  className?: string
  disabled?: boolean
}

export function ManageBillingButton({
  children,
  variant = 'outline',
  className = '',
  disabled = false,
}: PropTypes) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const result = await createBillingPortalSession()
      if (result?.url) {
        window.location.href = result.url
      }
    } catch (err) {
      console.error('Billing portal error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      className={className}
      variant={variant}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? 'Opening…' : children}
    </Button>
  )
}
