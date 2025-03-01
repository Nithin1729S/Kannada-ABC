import Triangle from '~components/letters/Triangle';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Triangle - Connect Dots',
  description: 'Connect the dots to form a triangle shape',
};

export default function TrianglePage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/shapes" 
            className="text-primary hover:underline"
          >
            ← Back to Shapes
          </Link>
        </div>
        
        <Triangle />
        
        <div className="mt-12 max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-semibold mb-4">How to Play</h3>
          <ol className="space-y-2 text-muted-foreground">
            <li>1. Click on dot number 1 to start</li>
            <li>2. Move to dot number 2 and click to connect</li>
            <li>3. Finally, click on dot number 3 to complete the triangle</li>
            <li>4. The shape will automatically close, connecting back to dot 1</li>
            <li>5. Click "Reset" to try again</li>
          </ol>
        </div>
      </div>
    </main>
  );
}