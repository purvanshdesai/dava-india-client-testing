import Image from 'next/image'
import React, { useState, ReactNode, useRef, useEffect } from 'react'
import { Trash2Icon } from 'lucide-react'
import { pdfjs } from 'react-pdf'
import { uploadFiles } from '@/utils/fileUpload'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useTransitionRouter } from 'next-view-transitions'
import heic2any from 'heic2any'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjs.GlobalWorkerOptions.workerSrc =
  '/pdf.worker.min.mjs'

interface FileUpdateComponentProps {
  renderButton?: (handleUpload: () => void, isLoading: boolean) => ReactNode
  onFileUpload: (files: any, filesObject?: any) => void
  isLoggedIn: boolean
}

const PrescriptionFileUploadComponent: React.FC<FileUpdateComponentProps> = ({
  renderButton,
  onFileUpload,
  isLoggedIn
}) => {
  const router = useTransitionRouter()
  const { prescriptionFiles } = useCheckoutStore(state => state)
  const fileBtn = useRef<any>(null)
  const [files, setFiles] = useState<any[]>(
    prescriptionFiles?.length ? prescriptionFiles : []
  )
  const [filesObject, setFilesObject] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

  const allowedFileTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'image/heif',
    'image/heic'
  ]

  const openFilePicker = () => {
    if (!isLoggedIn) {
      router.push(
        `/login?redirect=${encodeURIComponent('/prescription/upload')}`
      )
      return
    }
    fileBtn?.current?.click()
  }

  const convertHeifToJpg = async (hFile: File) => {
    try {
      const blob: any = await heic2any({
        blob: hFile,
        toType: 'image/jpg'
      })

      // Convert Blob to File
      const file = new File(
        [blob],
        hFile?.name?.replace('heic', 'jpg')?.replace('heif', 'jpg'),
        {
          type: 'image/jpg'
        }
      )

      // You can now use the File object for uploads or other purposes
      return file
    } catch (error) {
      console.error('Conversion failed:', error)
      return null
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setLoading(true)

      const selectedFiles = event.target.files

      if (!selectedFiles) return

      const validFiles: File[] = []
      const invalidFiles: string[] = []

      for (const file of Array.from(selectedFiles)) {
        if (allowedFileTypes.includes(file.type)) {
          if (file.type === 'image/heif' || file.type === 'image/heic') {
            const convertedFile: File | null = await convertHeifToJpg(file)
            if (convertedFile) validFiles.push(convertedFile)
          } else validFiles.push(file)
        } else {
          invalidFiles.push(file.name)
        }
      }

      if (invalidFiles.length > 0) {
        setError(`Invalid files: ${invalidFiles.join(', ')}`)
      } else {
        setError(null)
      }

      // Upload to Server
      const files = await uploadFiles(validFiles)
      const fileUrls = files?.map((file: any) => file?.objectUrl)
      setFiles(prevFiles => [...prevFiles, ...fileUrls])
      setFilesObject(files)
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFile = (objectUrl: string) => {
    setFiles(prevFiles => prevFiles.filter(url => url !== objectUrl))
    setFilesObject(prevFiles =>
      prevFiles.filter(obj => obj?.objectUrl !== objectUrl)
    )
  }

  const displayedFiles =
    isCollapsed && files.length > 2 ? files.slice(0, 2) : files
  const hiddenCount = isCollapsed && files.length > 2 ? files.length - 2 : 0

  useEffect(() => {
    // if (files.length) {
    onFileUpload(files, filesObject)
    // }
  }, [files])

  return (
    <div className='file-update-component'>
      <input
        ref={fileBtn}
        type='file'
        multiple
        accept='.png, .jpeg, .jpg, .pdf, .heif, .heic'
        onChange={handleFileChange}
        className='hidden'
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {renderButton ? (
        renderButton(openFilePicker, isLoading)
      ) : (
        <button onClick={openFilePicker} disabled={!files.length}>
          Upload File
        </button>
      )}

      <div className='mt-4 flex flex-wrap gap-4 rounded-md bg-primary-light-blue p-3'>
        {displayedFiles.map((file: string, idx: number) => {
          const isPdf = file.toLowerCase().endsWith('.pdf')
          return (
            <div
              key={idx}
              className='relative h-52 w-48 overflow-hidden rounded-md'
            >
              {isPdf ? (
                <iframe
                  src={file}
                  className='h-full w-full'
                  title={`PDF Preview ${idx}`}
                />
              ) : (
                <Image
                  src={file}
                  alt='Image File preview'
                  fill
                  objectFit='fill'
                />
              )}
              <div
                onClick={() => handleRemoveFile(file)}
                className='absolute right-1 top-1 cursor-pointer rounded-full bg-red-500 bg-opacity-30 p-1.5'
              >
                <Trash2Icon size={18} className='text-red-600' />
              </div>
            </div>
          )
        })}

        {hiddenCount > 0 || !isCollapsed ? (
          <div
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='relative flex h-52 w-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border border-dashed border-gray-400'
          >
            {isCollapsed ? (
              <>
                <span className='text-lg font-semibold text-gray-600'>
                  +{hiddenCount}
                </span>
                <span className='mt-1 text-xs text-primary underline'>
                  Show More
                </span>
              </>
            ) : (
              <span className='text-xs text-primary underline'>Show Less</span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default PrescriptionFileUploadComponent
