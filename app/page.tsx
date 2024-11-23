import TransactionForm from '@/components/TransactionForm'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-8 transition-colors duration-300">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          SOL Transaction Manager
          </h1>
          <p className="text-muted-foreground">
            Send SOL on the Devnet or Mainnet securely (happy face emoji)
          </p>
        </div>
        <TransactionForm />
      </div>
    </main>
  )
}