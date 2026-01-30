import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import type { MouseEvent } from 'react'

const CTA_LABEL = 'Buy Now'
const CTA_PATH = '/'
const CTA_HASH = 'pricing'
// const LOGIN_LABEL = 'Login'

type PropTypes = {
  onNavigateToPricing?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export default function HeaderSignUpLogin({ onNavigateToPricing }: PropTypes) {
  return (
    <Link
      to={CTA_PATH}
      hash={CTA_HASH}
      onClick={(event) => onNavigateToPricing?.(event)}
    >
      <Button size="sm" className="h-6">
        {CTA_LABEL}
      </Button>
    </Link>
  )
}
