import config from '@/appConfig'

const iconSizeToCSSclassMap = {
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
  const classNameForIconSize = iconSizeToCSSclassMap[size]

  return (
    <svg
      className={classNameForIconSize}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`${config.appName} logo`}
    >
      <title>{`${config.appName} logo`}</title>
      <style>
        {`.s0 { fill: #b9d2d6;stroke: #000000;paint-order:stroke fill markers;stroke-linejoin: round;stroke-width: 40 }
        .s1 { fill: #9fbdbf }
        .s2 { fill: #d5e5e5 }
        .s3 { fill: #f4d48b;stroke: #000000;paint-order:stroke fill markers;stroke-linejoin: round;stroke-width: 40 }
        .s4 { fill: #e6bc68 }
        .s5 { fill: #fae4aa }
        .s6 { fill: #000000 }
        .s7 { fill: none;stroke: #000000;stroke-linecap: round;stroke-width: 20 }`}
      </style>
      <g>
        <g>
          <path
            className="s0"
            d="m25.98 381.45c21.79 54.76 46.19 66.42 84.13 100.03 36.38 32.24 323.63-15.84 371.82-2.12 13.11 3.73 11.75-105.84-52.87-129.85-155.17-57.63-441.53-64.7-403.08 31.94z"
          />
          <path
            className="s1"
            d="m54.9 431.66c15.18 17.86 32.81 29.98 55.21 49.82 36.38 32.24 323.63-15.84 371.82-2.12 5.08 1.45 7.99-14.39 5.74-35.78-159.51 19.6-333.66 40.48-432.77-11.92z"
          />
          <path
            className="s2"
            d="m465.45 379.13c-8.93-13.04-20.84-23.84-36.39-29.62-141.89-52.7-395.43-63.19-406.61 7.71 102.05-51.67 291.96-29.37 443 21.91z"
          />
          <path
            className="s3"
            d="m72.5 233.57c0 0 41.12-174.05 76.33-205.48 35.22-31.43 242.82 48.63 273.33 103.12 30.5 54.49 8.48 133.29 8.48 133.29-13.99 43.55-374.12 18.79-358.14-30.93z"
          />
          <path
            className="s4"
            d="m72.5 233.57c0 0 6.65-26.98 9.21-36.11 3.4 27.99 349.84 77.51 353.38 45.39 1.48-13.44-4.45 21.65-4.45 21.65-13.99 43.55-374.12 18.79-358.14-30.93z"
          />
          <path
            className="s5"
            d="m129.93 56.26c11.91-25.8 12.7-22.63 18.9-28.17 35.22-31.43 242.82 48.63 273.33 103.12 5.69 10.17 17.16 41.72 11.38 34.16-63.15-82.65-206.66-127.41-303.61-109.11z"
          />
        </g>
        <path
          fillRule="evenodd"
          className="s6"
          d="m205.09 148.41c-11.07 0-20.02-9.07-20.02-20.3 0-11.22 8.95-20.29 20.02-20.29 11.07 0 20.02 9.07 20.02 20.29 0 11.23-8.95 20.3-20.02 20.3z"
        />
        <path
          fillRule="evenodd"
          className="s6"
          d="m306.35 150.59c-11.06 0-20.01-9.07-20.01-20.3 0-11.22 8.95-20.29 20.01-20.29 11.07 0 20.02 9.07 20.02 20.29 0 11.23-8.95 20.3-20.02 20.3z"
        />
        <path
          fillRule="evenodd"
          className="s7"
          d="m201.71 183c2 46.39 108.92 54.16 108.92 0"
        />
      </g>
    </svg>
  )
}
