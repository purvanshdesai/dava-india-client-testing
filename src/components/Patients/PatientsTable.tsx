'use client'
import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Patient } from '../utils/icons'
import { PatientsDialog } from './PatientsDialog'
import usePatientsStore from '@/store/userPatientsStore'
import AlertBox from '../AlertBox'
import { deleteUserPatient } from '@/utils/actions/patientsActions'

export default function PatientTable() {
  const { patients, fetchPatients } = usePatientsStore(state => state)
  const [open, setOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleDeletePatient = (patientId: string) => {
    try {
      setPatientToDelete(patientId)
      setOpen(true)
    } catch (error) {
      console.log(error)
    }
  }

  const onContinue = async () => {
    try {
      await deleteUserPatient(patientToDelete)
      fetchPatients()
    } catch (error) {
      console.log(error)
    }
  }

  const calculateAge = (dateOfBirth: string): number => {
    const dob = new Date(dateOfBirth)
    const now = new Date()

    let age = now.getFullYear() - dob.getFullYear()
    const hasHadBirthdayThisYear =
      now.getMonth() > dob.getMonth() ||
      (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate())

    if (!hasHadBirthdayThisYear) {
      age--
    }

    return age
  }

  const filteredPatients = patients?.filter((patient: any) =>
    patient?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='rounded-lg bg-white p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Patients</h1>
        <div className='mb-4 flex items-center gap-2'>
          <input
            type='text'
            placeholder='Search'
            className='w-96 rounded-full border p-2 px-4'
            onChange={e => setSearchQuery(e.target.value)}
          />

          <PatientsDialog />
        </div>
      </div>

      {patients?.length > 0 ? (
        <table className='w-full table-auto border-separate border-spacing-y-3'>
          <thead>
            <tr className='text-left'>
              <th className='px-2'>Patient name</th>
              <th className='px-2'>Age</th>
              <th className='px-2'>Gender</th>
              <th className='px-2'>Relation</th>
              <th className=''></th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient: any, index: number) => (
              <tr key={index} className='rounded-lg bg-white shadow'>
                <td className='flex items-center px-2 py-3'>
                  <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-400 font-bold text-white'>
                    {Patient}
                  </div>
                  {patient?.name}
                </td>
                <td className='px-2'>
                  {' '}
                  {patient?.dateOfBirth
                    ? calculateAge(patient.dateOfBirth)
                    : '—'}
                </td>
                <td className='px-2'>{patient?.gender}</td>
                <td className='px-2'>{patient?.relation}</td>
                <td className=''>
                  <Trash2
                    size={16}
                    className='cursor-pointer'
                    onClick={() => handleDeletePatient(patient?._id)}
                  />
                </td>
                <td className=''>
                  <PatientsDialog
                    patientId={patient?._id}
                    patientDetails={patient}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      <AlertBox
        openState={[open, setOpen]}
        content={'Are you sure you want to delete this patient?'}
        onContinue={onContinue}
      />
    </div>
  )
}
