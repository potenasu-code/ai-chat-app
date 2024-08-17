import React from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import Sidebar from './Sidebar'
const MobileSidebar = () => {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className='lg:hidden hover:bg-transparent'>
                <Menu />
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className='p-0 w-72'>
            <SheetHeader>
            <SheetTitle className='hidden'>Are you absolutely sure?</SheetTitle>
            <SheetDescription className='hidden'>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
            </SheetDescription>
            </SheetHeader>
            <Sidebar />
        </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar