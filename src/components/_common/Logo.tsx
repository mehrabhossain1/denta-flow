import config from '@/appConfig'
import { Link } from '@tanstack/react-router'
import LogoIcon from './LogoIcon'

type PropTypes = {
  to?: string
  shouldLink?: boolean
  showBeta?: boolean
  version?: 1 | 2
  className?: string
  isIconOnly?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const Logo = ({
  to = '/',
  shouldLink = true,
  isIconOnly,
  size = 'md',
  showBeta = false,
}: PropTypes) => {
  const textSizeToCSSclassMap = {
    xs: 'text-xs md:text-xs',
    sm: 'text-sm md:text-base',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2x',
  }
  const classNameForTextSize = textSizeToCSSclassMap[size]

  let content = (
    <div className="flex items-center md:justify-start gap-1">
      <LogoIcon size={size} />
      <div
        className={`font-extrabold tracking-tight text-black dark:text-white ${classNameForTextSize}`}
      >
        {config.appName}
        {showBeta && <sup className="font-normal pl-1">beta</sup>}
      </div>
    </div>
  )

  if (isIconOnly) {
    content = <LogoIcon size={size} />
  }

  if (shouldLink) {
    return (
      <Link
        to={to}
        aria-current="page"
        className="flex items-center gap-2 md:justify-start"
      >
        {content}
      </Link>
    )
  }

  return content
}

export default Logo
