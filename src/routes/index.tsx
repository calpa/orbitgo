import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export const Route = createFileRoute('/')({
  component: LoginPage,
})

function LoginPage() {
  const { isConnected } = useAccount()
  const navigate = Route.useNavigate()

  // Redirect to dashboard when connected
  useEffect(() => {
    if (isConnected) {
      navigate({ to: '/dashboard' })
    }
  }, [isConnected, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome</h1>
          <p className="mt-2 text-gray-600">Connect your wallet to continue</p>
        </div>

        <div className="mt-8 flex justify-center">
          <ConnectButton />
        </div>

        {isConnected && (
          <div className="mt-4 text-center text-sm text-gray-500">
            <p className="mt-2">Connected! Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  )
}
