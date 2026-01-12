'use client'
import React, { useState } from 'react'
import Image from 'next/image'
// import { CircleIcon } from 'lucide-react'
import TranslationHandler from '@/components/utils/TranslationHandler'
import { DotIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
const productDetails = {
  aboutProduct: {
    sectionsEnabled: [
      'drugInteraction',
      'suitableFor',
      'benefits',
      'specification',
      'dosage',
      'cautions',
      'sideEffects',
      'directionsForUse',
      'productInfo',
      'sellerInfo',
      'manufacturerInfo',
      'packagedByInfo'
    ]
  }
}
interface Product {
  product: any
}
export default function ProductDescription({ product }: Product) {
  const { sectionsEnabled } = productDetails.aboutProduct
  const [aboutProduct] = useState<any>(product?.current?.aboutProduct ?? {})
  const productTranslation = useTranslations('Product')

  const extractPlainText = (htmlString: string) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlString
    return tempDiv.innerText
  }
  const renderSectionContent = (section: any) => {
    switch (section) {
      case 'drugInteraction':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <Image
                src={`/images/ProductDescription/drugInteraction.svg`}
                alt='Caution'
                width={30}
                height={30}
              />
              <span className='text-base font-semibold'>Drug Interaction</span>
            </div>

            {/* <p>{aboutProduct.sellerInfo}</p> */}
            <div>
              <TranslationHandler
                word={aboutProduct?.drugInteraction}
                translations={
                  product?.current?.translations?.aboutProduct
                    ?.drugInteraction ?? {}
                }
              />
            </div>
          </div>
        )
      case 'suitableFor':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <Image
                src={`/images/ProductDescription/People.svg`}
                alt='Suitable For'
                width={30}
                height={30}
              />
              <span className='text-base font-semibold'>
                {productTranslation('suitable_for')}
              </span>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              {aboutProduct.suitableFor?.map((item: any, index: any) => (
                <div key={index} className='relative flex items-start gap-2'>
                  <DotIcon
                    size={40}
                    className='absolute -top-[10px] text-primary'
                  />
                  <div className='w-[calc(100%-40px)] pl-10'>
                    <TranslationHandler
                      key={index}
                      word={item}
                      translations={
                        (product?.current?.translations?.aboutProduct
                          ?.suitableFor &&
                          product.current.translations.aboutProduct.suitableFor[
                            index
                          ]) ??
                        {}
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'benefits':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <Image
                src={`/images/ProductDescription/Benefit.svg`}
                alt='Benefits'
                width={30}
                height={30}
              />
              <span className='text-base font-semibold'>
                {productTranslation('benefits')}
              </span>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              {/* {aboutProduct?.benefits?.map((benefit: string, idx: number) => (
                <div key={idx} className='flex items-center gap-2'>
                  <DotIcon size={30} className='text-primary' />
                  {benefit}
                </div>
              ))} */}
              {/* <div key={idx} className='flex items-center gap-2'>
                <DotIcon size={30} className='text-primary' />
              </div> */}
              {aboutProduct.benefits?.map((item: any, index: any) => (
                <div key={index} className='relative flex items-start gap-2'>
                  <DotIcon
                    size={40}
                    className='absolute -top-[10px] text-primary'
                  />
                  <div className='w-[calc(100%-40px)] pl-10'>
                    <TranslationHandler
                      key={index}
                      word={item}
                      translations={
                        (product?.current?.translations?.aboutProduct
                          ?.benefits &&
                          product.current.translations.aboutProduct.benefits[
                            index
                          ]) ??
                        {}
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'specification':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <Image
                src={`/images/ProductDescription/Specification.svg`}
                alt='Specification'
                width={30}
                height={30}
              />
              <span className='text-base font-semibold'>
                {productTranslation('specification')}
              </span>
            </div>
            <p>{aboutProduct?.specification}</p>
            <div>
              <TranslationHandler
                word={aboutProduct?.specification}
                translations={
                  product?.current?.translations?.aboutProduct?.specification ??
                  {}
                }
              />
            </div>
          </div>
        )
      case 'dosage':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <Image
                src={`/images/ProductDescription/Dosage.svg`}
                alt='Dosage'
                width={30}
                height={30}
              />
              <span className='text-base font-semibold'>
                {productTranslation('dosage')}
              </span>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              {aboutProduct.dosage?.map((item: any, index: any) => (
                <div key={index} className='relative flex items-start gap-2'>
                  <DotIcon
                    size={40}
                    className='absolute -top-[10px] text-primary'
                  />
                  <div className='w-[calc(100%-40px)] pl-10'>
                    <TranslationHandler
                      key={index}
                      word={item}
                      translations={
                        (product?.current?.translations?.aboutProduct?.dosage &&
                          product.current.translations.aboutProduct.dosage[
                            index
                          ]) ??
                        {}
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'cautions':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <Image
                src={`/images/ProductDescription/Caution.svg`}
                alt='Caution'
                width={30}
                height={30}
              />
              <span className='text-base font-semibold'>
                {productTranslation('caution')}
              </span>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              {aboutProduct.cautions?.map((item: any, index: any) => (
                <div key={index} className='relative flex items-start gap-2'>
                  <DotIcon
                    size={40}
                    className='absolute -top-[10px] text-primary'
                  />
                  <div className='w-[calc(100%-40px)] pl-10'>
                    <TranslationHandler
                      key={index}
                      word={item}
                      translations={
                        (product?.current?.translations?.aboutProduct
                          ?.cautions &&
                          product.current.translations.aboutProduct.cautions[
                            index
                          ]) ??
                        {}
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'sideEffects':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <Image
                src={`/images/ProductDescription/ProductSpecification.svg`}
                alt='Caution'
                width={30}
                height={30}
              />
              <span className='text-base font-semibold'>
                {productTranslation('side_effects')}
              </span>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              {aboutProduct.sideEffects?.map((item: any, index: any) => (
                <div key={index} className='relative flex items-start gap-2'>
                  <DotIcon
                    size={40}
                    className='absolute -top-[10px] text-primary'
                  />
                  <div className='w-[calc(100%-40px)] pl-10'>
                    <TranslationHandler
                      key={index}
                      word={item}
                      translations={
                        (product?.current?.translations?.aboutProduct
                          ?.sideEffects &&
                          product.current.translations.aboutProduct.sideEffects[
                            index
                          ]) ??
                        {}
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'productInfo':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              {' '}
              <Image
                src={`/images/ProductDescription/KeyIngredients.svg`}
                alt='Caution'
                width={30}
                height={30}
              />
              <span className='text-base font-semibold'>
                {productTranslation('key_ingredients')}
              </span>
            </div>

            {/* <p>{aboutProduct.sellerInfo}</p> */}
            <div>
              <TranslationHandler
                word={aboutProduct?.productInfo}
                translations={
                  product?.current?.translations?.aboutProduct?.productInfo ??
                  {}
                }
              />
            </div>
          </div>
        )
      case 'sellerInfo':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <Image
                src={`/images/ProductDescription/Seller.svg`}
                alt='Caution'
                width={30}
                height={30}
              />
              <span className='text-base font-semibold'>
                {productTranslation('seller_info')}
              </span>
            </div>

            {/* <p>{aboutProduct.sellerInfo}</p> */}
            <div>
              <TranslationHandler
                word={aboutProduct?.sellerInfo}
                translations={
                  product?.current?.translations?.aboutProduct?.sellerInfo ?? {}
                }
              />
            </div>
          </div>
        )
      case 'manufacturerInfo':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              {' '}
              <Image
                src={`/images/ProductDescription/manufacturer.svg`}
                alt='Caution'
                width={30}
                height={30}
              />
              <span className='text-base font-semibold'>
                {productTranslation('manufactured_by')}
              </span>
            </div>

            {/* <p>{aboutProduct.manufacturerInfo}</p> */}
            <div>
              <TranslationHandler
                word={aboutProduct?.manufacturerInfo}
                translations={
                  product?.current?.translations?.aboutProduct
                    ?.manufacturerInfo ?? {}
                }
              />
            </div>
          </div>
        )
      case 'packagedByInfo':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              {' '}
              <Image
                src={`/images/ProductDescription/PackedBy.svg`}
                alt='Caution'
                width={30}
                height={30}
              />
              <span className='text-base font-semibold'>
                {productTranslation('packaged_by')}
              </span>
            </div>

            <div>
              <TranslationHandler
                word={aboutProduct?.packagedByInfo}
                translations={
                  product?.current?.translations?.aboutProduct
                    ?.packagedByInfo ?? {}
                }
              />
            </div>
          </div>
        )
      case 'directionsForUse':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              {' '}
              <Image
                src={`/images/ProductDescription/DirectionForUse.svg`}
                alt='Caution'
                width={30}
                height={30}
              />
              <span className='text-base font-semibold'>
                {productTranslation('directions_for_use')}
              </span>
            </div>

            {/*<p>{aboutProduct.packagedByInfo}</p>*/}
            <div>
              <TranslationHandler
                word={aboutProduct?.directionsForUse}
                translations={
                  product?.current?.translations?.aboutProduct
                    ?.directionsForUse ?? {}
                }
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='bg-white p-4 text-sm md:p-6'>
      <div className='flex items-center gap-1 pb-3'>
        <p className='text-base font-semibold'>
          {productTranslation('description')}
        </p>
      </div>

      <div className='space-y-6'>
        {/* <div dangerouslySetInnerHTML={{ __html: aboutProduct?.info }} /> */}
        <div className='mb-3' id='about-div'>
          <TranslationHandler
            word={extractPlainText(aboutProduct?.info)}
            translations={
              product?.current?.translations?.aboutProduct?.info ?? {}
            }
            isHTML={true}
          />
        </div>

        {sectionsEnabled.map((section, idx) => {
          const content = aboutProduct[section]
          if (!content || (content && !content?.length)) return <></>
          return (
            <div key={idx} className='space-y-4'>
              {renderSectionContent(section)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
