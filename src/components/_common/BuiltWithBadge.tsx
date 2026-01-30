import Logo from '@/components/_common/Logo'

const BuiltWithBadge = () => {
  return (
    <div className="fixed bg-base-100 text-xs flex gap-2 items-center border py-1 px-2 rounded-tl-lg right-0 bottom-0">
      Built with <Logo size="xs" />
    </div>
  )
}

export default BuiltWithBadge
