import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className='bg-blue-900 w-screen h-screen'>
      <button className = "bg-white p-2">Login with Google</button>
    </div>
  )
}
