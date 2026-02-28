import config from '@/appConfig'

const iconSizeToCSSclassNameMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4 md:w-5 md:h-5',
  md: 'w-6 h-6 md:w-7 md:h-7',
  lg: 'w-7 h-7 md:w-8 md:h-8',
  xl: 'w-8 h-8 md:w-9 md:h-9',
}

type PropTypes = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export default ({ size = 'md' }: PropTypes) => {
  const classNameForIconSize = iconSizeToCSSclassNameMap[size]

  return (
    <img
      src="/icon.svg"
      className={classNameForIconSize}
      alt={`${config.appName} logo`}
    />
  )
}
