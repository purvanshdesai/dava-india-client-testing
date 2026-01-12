import React, { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import TranslationHandler from '../utils/TranslationHandler'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'

const Category = () => {
  const router = useRouter()
  const { slug: categorySlug } = useParams()
  const [activeAccordion, setActiveAccordion] = useState<any>('item-0')

  const handleAccordionChange = (value: string) => {
    setActiveAccordion(value === activeAccordion ? null : value) // Toggle active state
  }

  const handleCategoryClick = (level1: any, level2?: any, level3?: any) => {
    let path = level1?.slugUrl
    if (level2) path += '/' + level2?.slugUrl
    if (level3) path += '/' + level3?.slugUrl

    router.push(`/categories/${path}`)
  }

  const filteredCategories = [].filter((n: any) => {
    return categorySlug?.includes(n?.slugUrl)
  })

  if (!filteredCategories?.length) return <></>

  return (
    <div className='mt-5 rounded-xl bg-white p-1'>
      {/* Header */}
      <div className='flex items-center justify-between border-b px-3 py-2'>
        <p className='font-semibold'>Categories</p>
      </div>

      {/* Category List */}
      <div className='px-5'>
        {filteredCategories
          ?.filter((d: any) => d.isActive)
          .map((level1: any, idx: any) => (
            <Accordion
              type='single'
              collapsible
              key={level1._id}
              value={activeAccordion}
              onValueChange={handleAccordionChange} // Update the active accordion state
            >
              <AccordionItem value={`item-${idx}`} className='border-b-0'>
                <AccordionTrigger className={`py-2 hover:no-underline`}>
                  <p
                    className={`text-sm font-medium ${categorySlug?.length == 1 && categorySlug[0] === level1?.slugUrl ? 'font-semibold text-primary' : 'font-medium'}`}
                    onClick={() => handleCategoryClick(level1)}
                  >
                    <TranslationHandler
                      word={level1.name}
                      translations={level1?.translations?.name}
                    />
                  </p>
                </AccordionTrigger>
                <AccordionContent className=''>
                  <ul className='w-full space-y-2'>
                    {level1?.items
                      ?.filter((sub: any) => sub.isActive)
                      .map((level2: any, subIdx: any) => (
                        <li key={level2._id || subIdx} className='w-full'>
                          <label
                            htmlFor={`sub-${subIdx}`}
                            className={`cursor-pointer text-xs capitalize ${categorySlug?.length == 2 && categorySlug[1] === level2?.slugUrl ? 'font-semibold text-primary' : 'font-medium text-gray-900'}`}
                            onClick={() => handleCategoryClick(level1, level2)}
                          >
                            <TranslationHandler
                              word={level2.name}
                              translations={level2?.translations}
                            />
                          </label>
                          <div className='flex flex-col pl-1.5'>
                            {level2?.items
                              ?.filter((si: any) => si.isActive)
                              .map((l3: any, subIdx: any) => (
                                <div
                                  key={l3._id || subIdx}
                                  className='flex items-center py-1.5'
                                >
                                  <label
                                    htmlFor={`sub-${subIdx}`}
                                    className={`cursor-pointer text-xs capitalize ${categorySlug?.includes(l3?.slugUrl) ? 'font-semibold text-primary' : 'font-medium text-label'}`}
                                    onClick={() =>
                                      handleCategoryClick(level1, level2, l3)
                                    }
                                  >
                                    <TranslationHandler
                                      word={l3.name}
                                      translations={l3?.translations}
                                    />
                                  </label>
                                </div>
                              ))}
                          </div>
                        </li>
                      ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
      </div>
    </div>
  )
}

export default Category
