import Image from "next/image"
import Link from "next/link"
import { Search, Play, Plus } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0c0f] text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 bg-[#0b0c0f]/90 sticky top-0 z-50">
        <div className="flex items-center space-x-8">
          <Image
            src="/placeholder.svg?height=40&width=70"
            alt="Hulu"
            width={70}
            height={40}
            className="brightness-0 invert"
          />
          <div className="hidden md:flex space-x-6 text-sm">
            <Link href="#" className="hover:text-gray-300">
              Home
            </Link>
            <Link href="#" className="hover:text-gray-300">
              TV Shows
            </Link>
            <Link href="#" className="hover:text-gray-300">
              Movies
            </Link>
            <Link href="#" className="hover:text-gray-300">
              Originals
            </Link>
            <Link href="#" className="hover:text-gray-300">
              Networks
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-800">
            <Search className="w-5 h-5" />
          </button>
          <button className="hidden md:block bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded text-sm">Log In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0f] to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0f] to-transparent z-10" />
        <div className="relative h-[500px] w-full">
          <Image src="/placeholder.svg?height=500&width=1200" alt="Featured Show" fill className="object-cover" />
        </div>
        <div className="absolute bottom-0 left-0 p-8 z-20 max-w-xl">
          <h1 className="text-4xl font-bold mb-2">The Handmaid's Tale</h1>
          <p className="text-sm text-gray-300 mb-4">New Episode • Drama • Dystopian</p>
          <p className="text-sm text-gray-300 mb-6">
            Set in a dystopian future, a woman is forced to live as a concubine under a fundamentalist theocratic
            dictatorship.
          </p>
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 bg-white text-black px-6 py-2 rounded hover:bg-gray-200">
              <Play className="w-4 h-4" />
              <span>Watch</span>
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <section className="px-4 py-8">
        <h2 className="text-xl font-medium mb-4">Continue Watching</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="group relative">
              <div className="relative h-[150px] rounded overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=150&width=250&text=Show${item}`}
                  alt={`Show ${item}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white/90 text-black p-2 rounded-full">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div className="h-full bg-green-500" style={{ width: `${30 + item * 10}%` }} />
                </div>
              </div>
              <h3 className="mt-2 text-sm">Popular Show Title {item}</h3>
              <p className="text-xs text-gray-400">
                S{item} E{item + 2}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-8">
        <h2 className="text-xl font-medium mb-4">Trending</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[6, 7, 8, 9, 10].map((item) => (
            <div key={item} className="group relative">
              <div className="relative h-[150px] rounded overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=150&width=250&text=Trending${item}`}
                  alt={`Trending ${item}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white/90 text-black p-2 rounded-full">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-2 text-sm">Trending Title {item}</h3>
              <p className="text-xs text-gray-400">Movie • {90 + item} min</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
