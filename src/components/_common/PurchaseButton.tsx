'use client'

import { createCheckoutSession } from '@/lib/billing/server'
import type { CheckoutMode, LineItem } from '@/lib/billing/types'
import { useState } from 'react'
import { Button } from '../ui/button'

type PropTypes = {
  children: React.ReactNode
  mode: CheckoutMode
  priceId?: string
  lineItems?: LineItem[]
  metadata?: Record<string, string>
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  disabled?: boolean
}

export function PurchaseButton({
  children,
  mode,
  priceId,
  lineItems,
  metadata,
  className = '',
  variant = 'default',
  disabled = false,
}: PropTypes) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const result = await (
        createCheckoutSession as unknown as (args: {
          data: {
            mode: CheckoutMode
            priceId?: string
            lineItems?: LineItem[]
            metadata?: Record<string, string>
          }
        }) => Promise<{ url: string }>
      )({
        data: { mode, priceId, lineItems, metadata },
      })
      if (result?.url) {
        window.location.href = result.url
      }
    } catch (err) {
      console.error('Checkout error:', err)
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
      {loading ? 'Redirecting…' : children}
    </Button>
  )
}
