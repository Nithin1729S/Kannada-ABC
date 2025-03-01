import Star from '~/src/components/letters/S'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Star - Connect Dots',
  description: 'Connect the dots to form a star shape',
}

export default function StarPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/shapes" className="text-primary hover:underline">
            ← Back to Shapes
          </Link>
        </div>

        <Star />

        <div className="mt-12 max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-semibold mb-4">How to Play</h3>
          <ol className="space-y-2 text-muted-foreground">
            <li>1. Click on dot number 1 to start</li>
            <li>2. Follow the numerical sequence, connecting dots 1 through 10 in order</li>
            <li>3. The shape will automatically close, connecting back to dot 1</li>
            <li>4. Click "Reset" to try again</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            <strong>Tip:</strong> This is an advanced shape. Take your time and follow the numbers
            carefully to create a perfect star.
          </p>
        </div>
      </div>
    </main>
  )
}
