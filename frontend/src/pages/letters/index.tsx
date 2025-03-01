import { Metadata } from 'next'
import Link from 'next/link'
import { Triangle, Square, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shapes - Connect Dots',
  description: 'Choose a shape to connect the dots and create beautiful patterns',
}

export default function ShapesPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Choose a Shape</h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          Select a shape below to start connecting dots. Each shape has a different pattern and
          difficulty level.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/letters/triangle" className="group">
            <div className="bg-card hover:bg-accent transition-colors p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Triangle className="text-primary" size={32} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Triangle</h2>
              <p className="text-muted-foreground mb-4">
                A simple 3-point shape, perfect for beginners. Connect 3 dots to form a triangle.
              </p>
              <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full">
                Beginner
              </span>
            </div>
          </Link>

          <Link href="/letters/square" className="group">
            <div className="bg-card hover:bg-accent transition-colors p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Square className="text-primary" size={32} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Square</h2>
              <p className="text-muted-foreground mb-4">
                A 4-point shape with equal sides. Connect 4 dots to create a perfect square.
              </p>
              <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full">
                Intermediate
              </span>
            </div>
          </Link>

          <Link href="/letters/star" className="group">
            <div className="bg-card hover:bg-accent transition-colors p-6 rounded-lg shadow-sm border border-border flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Star className="text-primary" size={32} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Star</h2>
              <p className="text-muted-foreground mb-4">
                A complex 10-point star shape. Connect all 10 dots in sequence to form a beautiful
                star.
              </p>
              <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full">
                Advanced
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

