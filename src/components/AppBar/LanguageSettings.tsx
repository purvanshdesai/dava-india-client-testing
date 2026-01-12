import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { getUserLocale, setUserLocale } from '@/i18n/locale'
import { defaultLocale } from '@/i18n/config'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '../ui/button'

const languages = [
  { name: 'Language - English', code: 'en' },
  { name: 'অসমীয়া - Assamese', code: 'as' },
  { name: 'বাংলা - Bengali', code: 'bn' },
  { name: 'ગુજરાતી - Gujarati', code: 'gu' },
  { name: 'हिंदी - Hindi', code: 'hi' },
  { name: 'ಕನ್ನಡ - Kannada', code: 'kn' },
  { name: 'മലയാളം - Malayalam', code: 'ml' },
  { name: 'मराठी - Marathi', code: 'mr' },
  // { name: 'মণিপুরী - Manipuri', code: 'mni' },
  { name: 'नेपाली - Nepali', code: 'ne' },
  { name: 'ଓଡ଼ିଆ - Oriya', code: 'or' },
  { name: 'ਪੰਜਾਬੀ - Punjabi', code: 'pa' },
  { name: 'தமிழ் - Tamil', code: 'ta' },
  { name: 'తెలుగు - Telugu', code: 'te' },
  { name: 'भोजपुरी - Bhojpuri', code: 'boj' }
]
export default function LanguageSettings() {
  const [selectedLang, setSelectedLang] = useState<any>({})

  useEffect(() => {
    const setUserLocale = async () => {
      const locale = (await getUserLocale()) ?? defaultLocale
      setSelectedLang(languages.find((l: any) => l.code === locale))
    }

    setUserLocale()
  }, [])

  const handleLangChange = async (lang: any) => {
    await setUserLocale(lang.code)
    setSelectedLang(lang)
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <div className='flex flex-row text-sm'>
            <span>Language: {selectedLang?.name?.split('-')[1]}</span>
            <ChevronDown size={20} />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Language</DialogTitle>
            <DialogDescription>
              <div className='mt-5 h-[300px] overflow-auto'>
                <RadioGroup>
                  {languages.map((lang: any) => {
                    return (
                      <div
                        key={lang.code}
                        className={`flex cursor-pointer items-center space-x-2 rounded-md border py-1 pb-5 pl-3 pt-5 text-sm ${
                          selectedLang?.code === lang.code
                            ? 'border-orange-600'
                            : 'border-gray-300'
                        }`}
                        onClick={async () => handleLangChange(lang)}
                      >
                        <RadioGroupItem
                          className='text-primary'
                          value={lang.code}
                          id={lang.code}
                          checked={selectedLang?.code === lang.code}
                        />
                        <Label htmlFor={lang.code} className='cursor-pointer'>
                          {lang.name}
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className='flex flex-row items-center justify-center'>
              <DialogClose>
                <Button variant={'outline'}>Cancel</Button>
              </DialogClose>

              <DialogClose>
                <Button className='ml-5'>Apply</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
