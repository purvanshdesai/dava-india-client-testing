import { CircleUserRound } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useSession } from 'next-auth/react'
// import { handleSignOut } from '@/utils/actions/authActions'
import { useTransitionRouter } from 'next-view-transitions'
import InnerSideBar from '../InnerSideBar'

export default function ProfileSettings() {
  const session = useSession() as any
  const isLoggedIn = session.status === 'authenticated'
  const router = useTransitionRouter()

  // const handleSignOutUser = async () => {
  //   await handleSignOut()
  //   window.location.reload()
  //   return
  // }

  if (!isLoggedIn) {
    return (
      <div
        className='flex cursor-pointer items-center gap-2 pl-2 pr-4 text-sm'
        onClick={() => router.push('/login')}
      >
        <div
          className='rounded-full bg-gradient-to-b p-1.5'
          style={{
            background: 'linear-gradient(to bottom, #2DA771,#2A8D61)'
          }}
        >
          <CircleUserRound size={18} className='text-white' />
        </div>
        Sign {isLoggedIn ? 'Out' : 'In'}
        {isLoggedIn ? '' : ' / Sign Up'}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative mr-3 h-8 w-8 rounded-full outline-none'
        >
          <Avatar className='h-7 w-7'>
            <AvatarImage src='/images/userAvatar.svg' alt='avatar' />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='z-[10000] w-56' align='end' forceMount>
        <InnerSideBar isProfile={true} />
        {/* <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {session?.data?.user?.email}
            </p>
            <p className='text-muted-foreground text-xs leading-none'>
              {session?.data?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => router.push('/me/profile')}
          >
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => router.push('/me/orders')}
          >
            My Orders
            <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => router.push('/me/settings')}
          >
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleSignOutUser()}
          className='cursor-pointer'
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
