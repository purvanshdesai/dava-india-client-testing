'use client'

import * as React from 'react'
import { Smartphone, PhoneCallIcon, MailIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import Link from 'next/link'
import TranslationHandler from '../utils/TranslationHandler'
import { useTransitionRouter } from 'next-view-transitions'
import { useFetchNavigation } from '@/utils/hooks/navigationHooks'
import { useTranslations } from 'next-intl'

interface Category {
  _id: string
  name: string
  translations: any
  items: Array<any>
}

export default function CategoryMenu() {
  const { data: navigation } = useFetchNavigation()
  const router = useTransitionRouter()
  const common = useTranslations('Common')

  // const listData = categories?.length > 0 ? categories : []

  const listData = navigation?.length > 0 ? navigation : []

  const handleCategoryClick = (level1: any, level2?: any, level3?: any) => {
    let path = level1?.slugUrl
    if (level2) path += '/' + level2?.slugUrl
    if (level3) path += '/' + level3?.slugUrl

    router.push(`/categories/${path}`)
  }

  const [style, setStyle] = React.useState({
    backgroundColor: '#FDF0E9',
    border: '1px solid #F97316',
    borderRadius: '9999px',
    display: 'flex',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#F97316',
    alignItems: 'center',
    transition: 'background-color 0.5s, border-color 0.5s'
  })

  React.useEffect(() => {
    let isOrange = true
    const interval = setInterval(() => {
      setStyle(prevStyle => ({
        ...prevStyle,
        backgroundColor: isOrange ? '#FFFFFF' : '#FDF0E9',
        borderColor: isOrange ? 'white' : '#F97316'
      }))
      isOrange = !isOrange
    }, 1500) // Change every second

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  return (
    <div className='flex items-center justify-between bg-white px-7 py-1'>
      <NavigationMenu>
        <NavigationMenuList>
          {listData &&
            listData.map((level1: Category, idx: number) => {
              return (
                <NavigationMenuItem key={idx}>
                  <NavigationMenuTrigger>
                    <div
                      onClick={() => handleCategoryClick(level1)}
                      className='text-sm hover:text-primary'
                    >
                      <TranslationHandler
                        word={level1.name}
                        translations={level1?.translations?.name}
                      />
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className='left-0 max-h-96 overflow-y-auto rounded-md bg-white shadow-2xl'
                    style={{
                      scrollbarWidth: 'none' /* Firefox */,
                      msOverflowStyle: 'none' /* IE10+ */
                    }}
                  >
                    <ul className='grid w-[200px] gap-1.5 px-4 py-4'>
                      {level1?.items
                        ?.filter(sub => sub.isActive)
                        .map((level2, idx: number) => {
                          const hasSubMenu =
                            level2?.items && level2?.items?.length > 0

                          return (
                            <Collapsible key={idx} defaultOpen>
                              <div className='flex items-center justify-between'>
                                <ListItem
                                  key={level2._id}
                                  title={level2.name}
                                  translations={level2?.translations}
                                  item={level2}
                                  handleCategoryClick={() =>
                                    handleCategoryClick(level1, level2)
                                  }
                                ></ListItem>
                                {/* {hasSubMenu && (
                                  <CollapsibleTrigger>
                                    <div>
                                      <ChevronDownIcon
                                        size={18}
                                        className='text-label'
                                      />
                                    </div>
                                  </CollapsibleTrigger>
                                )} */}
                              </div>

                              {hasSubMenu && (
                                <CollapsibleContent className='space-y-1 pl-1.5 pt-1.5'>
                                  {level2?.items?.map(
                                    (l3: any, idx: number) => {
                                      return (
                                        <div key={idx} className='text-xs'>
                                          <ListItem
                                            key={l3._id}
                                            title={l3.name}
                                            translations={l3?.translations}
                                            item={l3}
                                            textClassName={'text-xs text-label'}
                                            handleCategoryClick={() =>
                                              handleCategoryClick(
                                                level1,
                                                level2,
                                                l3
                                              )
                                            }
                                          ></ListItem>
                                        </div>
                                      )
                                    }
                                  )}
                                </CollapsibleContent>
                              )}
                            </Collapsible>
                          )
                        })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            })}
        </NavigationMenuList>
      </NavigationMenu>

      <div className='flex items-center justify-end gap-4'>
        <Link href={'/shareApp'}>
          <div style={style}>
            <Smartphone size={16} />
            <span className='pl-2'>{common('get_the_app')}</span>
          </div>
        </Link>

        <div
          className='border3 flex cursor-pointer items-center gap-1 rounded-full py-1 text-xs font-medium text-label'
          onClick={() => (window.location.href = 'tel:+918471009009')}
        >
          <PhoneCallIcon className='text-label' size={16} />
          &nbsp;+91 847 100 9009
        </div>

        <div
          className='border3 flex cursor-pointer items-center gap-1 rounded-full py-1 text-xs font-medium text-label'
          onClick={() =>
            window.open(
              'https://mail.google.com/mail/?view=cm&fs=1&to=care@davaindia.com',
              '_blank'
            )
          }
        >
          <MailIcon className='text-label' size={16} />
          &nbsp;care@davaindia.com
        </div>
      </div>
    </div>
  )
}

const ListItem = ({
  className,
  title,
  children,
  translations,
  textClassName,
  handleCategoryClick,
  ...props
}: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            'hover:bg-accent focus:bg-accent focus:text-accent-foreground block cursor-pointer select-none space-y-1 rounded-md py-0.5 leading-none no-underline outline-none transition-colors hover:text-primary',
            className
          )}
          {...props}
          onClick={() => handleCategoryClick()}
        >
          <div
            className={cn('text-sm font-medium leading-none', textClassName)}
          >
            <TranslationHandler
              word={title}
              translations={translations?.name}
            />
          </div>
          <p className='text-muted-foreground line-clamp-2 cursor-pointer text-sm leading-snug'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
