"use client"

import { useState, FormEvent } from "react"
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js"
import bs58 from "bs58"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TransactionForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [network, setNetwork] = useState<"devnet" | "mainnet-beta">("devnet")
  const [payerPrivateKey, setPayerPrivateKey] = useState("")
  const [receiverPublicKey, setReceiverPublicKey] = useState("")
  const [lamports, setLamports] = useState("")

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    
    if (!payerPrivateKey || !receiverPublicKey || !lamports) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setIsLoading(true)
      
      try {
        const payerSecretKey = bs58.decode(payerPrivateKey)
        if (payerSecretKey.length !== 64) {
          throw new Error("Invalid private key format")
        }
        new PublicKey(receiverPublicKey)
      } catch (e) {
        toast.error("Invalid key format")
        return
      }

      const connection = new Connection(
        `https://api.${network}.solana.com`,
        "confirmed"
      )

      const payerSecretKey = bs58.decode(payerPrivateKey)
      const payer = Keypair.fromSecretKey(payerSecretKey)
      const receiverPubKey = new PublicKey(receiverPublicKey)

      const balance = await connection.getBalance(payer.publicKey)
      const transferAmount = parseInt(lamports)
      
      if (balance < transferAmount) {
        toast.error("Insufficient balance", {
          description: "The payer account doesn't have enough SOL",
        })
        return
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: receiverPubKey,
          lamports: transferAmount,
        })
      )

      transaction.feePayer = payer.publicKey
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      transaction.partialSign(payer)

      const signature = await connection.sendRawTransaction(
        transaction.serialize(),
        { maxRetries: 5 }
      )
      
      await connection.confirmTransaction(signature, "confirmed")
      
      toast.success("Transaction successful!", {
        description: (
          <a
            href={`https://explorer.solana.com/tx/${signature}?cluster=${network}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View on Solana Explorer
          </a>
        ),
      })
      
      // Reset form
      setPayerPrivateKey("")
      setReceiverPublicKey("")
      setLamports("")
    } catch (error) {
      toast.error("Transaction failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-8 shadow-lg">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">Network</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="devnet"
                checked={network === "devnet"}
                onChange={(e) => setNetwork(e.target.value as "devnet")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Devnet</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="mainnet-beta"
                checked={network === "mainnet-beta"}
                onChange={(e) => setNetwork(e.target.value as "mainnet-beta")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Mainnet</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Payer Private Key</label>
          <input
            type="password"
            value={payerPrivateKey}
            onChange={(e) => setPayerPrivateKey(e.target.value)}
            placeholder="Enter payer's private key"
            className={cn(
              "w-full rounded-md border bg-background px-3 py-2 text-sm font-mono",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              "placeholder:text-muted-foreground"
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Receiver Public Key</label>
          <input
            type="text"
            value={receiverPublicKey}
            onChange={(e) => setReceiverPublicKey(e.target.value)}
            placeholder="Enter receiver's public key"
            className={cn(
              "w-full rounded-md border bg-background px-3 py-2 text-sm font-mono",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              "placeholder:text-muted-foreground"
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount (Lamports)</label>
          <div className="relative">
            <input
              type="number"
              value={lamports}
              onChange={(e) => setLamports(e.target.value)}
              placeholder="Enter amount in lamports"
              min="1"
              max={1000 * LAMPORTS_PER_SOL}
              className={cn(
                "w-full rounded-md border bg-background px-3 py-2 pr-16 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                "placeholder:text-muted-foreground"
              )}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
              LAM
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {lamports && !isNaN(parseInt(lamports))
              ? `≈ ${(parseInt(lamports) / LAMPORTS_PER_SOL).toFixed(9)} SOL`
              : "1 SOL = 1,000,000,000 LAM"}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full rounded-md bg-primary px-4 py-2 text-primary-foreground",
            "hover:bg-primary/90",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Send Transaction"
          )}
        </button>
      </form>
    </div>
  )
}