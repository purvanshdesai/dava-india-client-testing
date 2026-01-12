'use client'
import React from 'react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import usePatientsStore from '@/store/userPatientsStore'
import useCheckoutStore from '@/store/useCheckoutStore'
import { PatientsDialog } from '../Patients/PatientsDialog'

const PatientSelection = (isConsultation: any) => {
  const { patients } = usePatientsStore(state => state)
  const { patientId, setPatientId } = useCheckoutStore(state => state)

  return (
    <div className='mx-auto mt-10 bg-white font-sans'>
      <div className='flex items-center justify-between bg-[#F9F9F9] px-4 py-2'>
        <h2 className='text-md font-semibold'>Select Patient</h2>
        <div>
          <PatientsDialog />
        </div>
      </div>

      <div
        className={`rounded-md border border-gray-200 p-4 ${isConsultation ? 'max-h-40 overflow-y-auto' : 'overflow-hidden'}`}
      >
        <RadioGroup value={patientId as any} onValueChange={setPatientId}>
          {patients.map((patient: any) => (
            <div key={patient._id} className='mb-2 flex items-center space-x-2'>
              <RadioGroupItem
                id={patient._id}
                value={patient._id}
                className='dark:bg-black dark:text-gray-300'
              />
              <label
                htmlFor={patient._id}
                className='text-sm text-gray-800 dark:text-gray-300'
              >
                {patient.name}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

export default PatientSelection
