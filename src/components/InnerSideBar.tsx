'use client'
import { handleSignOut } from '@/utils/actions/authActions'
import {
  Package,
  LogOut,
  Bell,
  MessageCircleMore,
  Pill,
  UserRound,
  UserRoundCog,
  IndianRupee,
  // Crown,
  CoinsIcon
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTransitionRouter, Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { trackUserLoggedOut } from '@/analytics/trackers/authTracker'
// import { isFeatureFlagEnabled } from './utils/FeatureFlag'

export default function InnerSideBar({ isProfile = false }) {
  const settingsmanager = useTranslations('SettingsManager')
  const common = useTranslations('Common')
  const { data: session } = useSession() as any

  // const isLoggedIn = session.status === 'authenticated'

  const handleSignOutUser = async () => {
    try {
      trackUserLoggedOut({
        name: session?.user?.name,
        email: session?.user?.email,
        dateTime: new Date().toISOString()
      })

      await handleSignOut()

      router.push('/login')

      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (e) {
      console.log(e)
    }
  }
  const router = useTransitionRouter()
  const sidebarOptions = [
    {
      label: 'My Profile',
      href: '/me/profile',
      icon: <UserRound size={isProfile ? 16 : 20} />,
      iconBg: '#37582A',
      i18nKey: 'my_profile'
    },

    {
      label: common('my_orders'),
      href: '/me/orders',
      icon: <Package size={isProfile ? 16 : 20} />,
      iconBg: '#37582A',
      i18nKey: 'my_orders'
    },
    // {
    //   label: 'Previously Bought',
    //   href: '/',
    //   icon: <PackageOpen size={isProfile ? 16 : 20} />,
    //   iconBg: '#37582A',
    //   i18nKey: 'previously_bought'
    // },
    // {
    //   label: 'DavaONE Membership',
    //   href: '/me/membership',
    //   icon: <Crown size={isProfile ? 16 : 20} />,
    //   iconBg: '#FCAA17',
    //   i18nKey: 'dava_membership',
    //   featureFlag: true,
    //   isFeatureFlagEnabled: true
    // },
    {
      label: 'Dava Wallet',
      href: '/me/dava-coins',
      icon: <CoinsIcon size={isProfile ? 16 : 20} />,
      iconBg: '#FCAA17',
      i18nKey: 'dava_coins'
    },
    // {
    //   label: 'Coupons',
    //   href: '/',
    //   icon: <TicketPercent size={isProfile ? 16 : 20} />,
    //   iconBg: '#37582A',
    //   i18nKey: 'coupons'
    // },
    {
      label: 'Patients',
      href: '/me/patients',
      icon: <UserRoundCog size={isProfile ? 16 : 20} />,
      iconBg: '#37582A',
      i18nKey: 'patients'
    },
    {
      label: 'Refer and Earn',
      href: '/me/refer-and-earn',
      icon: <IndianRupee size={isProfile ? 16 : 20} />,
      iconBg: '#37582A',
      i18nKey: 'refer-and-earn'
    },
    {
      label: 'Notifications',
      href: '/me/notifications',
      icon: <Bell size={isProfile ? 16 : 20} />,
      iconBg: '#37582A',
      i18nKey: 'notifications'
    },
    {
      label: 'Consultations',
      href: '/me/consultations',
      icon: <Pill size={isProfile ? 16 : 20} />,
      iconBg: '#37582A',
      i18nKey: 'consultations'
    },
    {
      label: 'Logout',
      href: '',
      icon: <LogOut size={isProfile ? 16 : 20} />,
      iconBg: '#DC2626',
      i18nKey: 'logout'
    }
  ]
  if (!isProfile)
    sidebarOptions.splice(sidebarOptions.length - 1, 0, {
      label: 'Need Help?',
      href: '/me/need-help',
      icon: <MessageCircleMore size={20} />,
      iconBg: '#37582A',
      i18nKey: 'need_help'
    })
  const pathname = usePathname()

  return (
    <div
      className={`divide-y divide-gray-300 rounded-lg ${isProfile ? 'p-2' : 'border p-4'} bg-white`}
    >
      <div className='flex items-center gap-3 p-1 pb-4'>
        <div style={{ position: 'relative', width: '32px', height: '32px' }}>
          <Image
            src={'/images/InnerSideBarImage.svg'}
            alt='Footer Logo'
            fill
            objectFit='contain'
          />
        </div>

        <div
          className={`flex w-36 flex-col ${isProfile ? 'text-xs' : 'text-sm'}`}
        >
          <div className='font-semibold'>
            {settingsmanager('hello')} {session?.data?.user?.name}
          </div>
          <div>
            {session?.data?.user?.phoneNumber?.replace(
              /(\+\d{2})(\d{5})(\d{5})/,
              '$1 $2 $3'
            )}
          </div>
        </div>
      </div>
      <div className=''>
        <ul
          className={`flex flex-col gap-1 text-sm ${isProfile ? 'mt-1.5' : ''}`}
        >
          {sidebarOptions.map((option, index) => {
            // if (option?.featureFlag && !option?.isFeatureFlagEnabled)
            //   return <></>

            const isActive = pathname.slice(3) === option.href

            return (
              <li
                key={index}
                className={`flex cursor-pointer items-center ${isProfile ? 'p-1' : 'p-2'} gap-3 rounded-md`}
                style={{
                  backgroundColor: !isProfile && isActive ? '#FDF0E9' : ''
                }}
              >
                <span
                  className='rounded-full p-2 text-white'
                  style={{ backgroundColor: option.iconBg }}
                >
                  {option.icon}
                </span>
                {option.label === 'Logout' ? (
                  <span
                    className={`${isProfile ? 'text-xs' : ''} cursor-pointer`}
                    onClick={() => handleSignOutUser()}
                  >
                    {settingsmanager('logout')}
                  </span>
                ) : (
                  <Link
                    href={option.href}
                    className={`${isProfile ? 'text-xs' : ''}`}
                  >
                    {option.i18nKey == 'patients' ||
                    'dava_coins' ||
                    'refer-and-earn'
                      ? option.label
                      : settingsmanager(option.i18nKey)}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
