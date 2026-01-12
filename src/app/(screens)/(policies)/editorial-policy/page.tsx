import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Dava India | Privacy Policy',
  description: 'Dava India Ecommerce app'
}

export default function PrivacyPolicy() {
  return (
    <div className='bg-gray-50 p-6 leading-relaxed'>
      <div className='mx-auto rounded-lg bg-white p-6 shadow-lg'>
        <h1 className='text-2xl font-bold'>
          INTELLECTUAL PROPERTY INFRINGEMENT POLICY
        </h1>

        <p className=''>
          This Intellectual Property Infringement Policy (“IP Policy”) must be
          read along with the Terms and Conditions and Editorial Policy of
          Davaindia.
        </p>

        <h2 className='mt-4 text-xl font-semibold'>Ownership</h2>
        <p className='mt-4'>
          The domain name
          <a href='https://www.davaindia.com' className='px-2 text-blue-500'>
            www.davaindia.com
          </a>
          an internet-based portal and Davaindia mobile application (Android and
          iOS) is owned and operated by Zota healthcare Ltd Retail Limited, a
          company duly incorporated under the provisions of the Companies Act,
          2013 (hereinafter referred to as “DavaIndia” or “We” or “Our” or “Us”
          or “Company”). The domain name and the mobile application are
          collectively (hereinafter referred to as the “Website”). The terms of
          this IP Policy constitute a legal and binding contract between you
          (hereinafter referred to as “You” or “Your” or the “User”) on one part
          and the Company on the other part.
        </p>
        <p className='mt-4'>
          The Company respects the intellectual property rights of all
          individuals and entities (“Persons”) and strictly prohibits its
          third-party service providers and all other third parties from using
          the Website to sell, distribute, circulate, post, upload, or in any
          other manner deal with any information, data, or content that
          infringes upon the intellectual property, including copyrights and
          trademarks, of any Persons.
        </p>
        <p className='mt-4'>
          In the event, You believe that Your intellectual property has been
          infringed upon by any material made available on the Website, You
          should notify the Website by sending an e-mail at
          (davaindia@davaindia.com) (“Claim"). You must also include the
          following information in Your Claim:
        </p>

        <h2 className='mt-4 text-xl font-semibold'>
          Intellectual Property Rights
        </h2>
        <p className=''>
          Davaindia respects the intellectual property rights of all individuals
          and entities and strictly prohibits third parties from using the
          Website to distribute or upload any content that infringes upon
          copyrights or trademarks.
        </p>

        <ul className='list-inside list-disc pl-6'>
          <li>
            The URL(s) through which the claimed infringing material is made
            available on the Website;
          </li>
          <li>
            Identification or description of the claimed infringing material;
          </li>
          <li>
            Intellectual property that is allegedly being infringed, including
            evidence of Your ownership of the intellectual property rights over
            the claimed infringing material;
          </li>
          <li>
            Your particulars including your full name, address, telephone
            number(s), and email address; and
          </li>
          <li>
            A statement that You have a good-faith belief that use of the
            claimed infringing material in question and the URL submitted is
            unauthorized by the rights owner or its licensee, and such use
            amounts to infringement under law. Such statement shall also declare
            that the information being provided by You is complete and accurate.
          </li>
        </ul>

        <p className='mt-4'>
          On receipt of such Claim along with the full particulars as provided
          above, the Company shall investigate the matter and determine whether
          your intellectual property has been infringed as mentioned in your
          claim. During such investigation by the Company, the Company may
          request You for further information in regard to your Claim or
          post-investigation may take the requisite action. Such action shall be
          determined at the sole discretion of the Company.
        </p>

        <p className='mt-4'>
          In case the information received in your Claim is found to be
          incomplete, frivolous, or untrue, the Company shall not be obliged to
          take actions and may re-activate the URL provided in the Claim at its
          sole discretion. The Company may also hold you liable for any civil
          and possibly criminal proceedings as per the applicable law.
        </p>
      </div>
    </div>
  )
}
