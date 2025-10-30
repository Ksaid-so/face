'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'

export default function MFASetupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'setup' | 'verify'>('setup')
  const [qrCode, setQrCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSetupMFA = async () => {
    setLoading(true)
    setError('')

    try {
      // In a real implementation, you would generate a QR code for TOTP
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate QR code generation
      setQrCode('https://placehold.co/200x200?text=QR+Code')
      setStep('verify')
    } catch (err) {
      setError('Failed to setup MFA')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setLoading(true)
    setError('')

    try {
      // In a real implementation, you would verify the TOTP code
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (code === '123456') { // Simulated correct code
        setSuccess(true)
      } else {
        setError('Invalid verification code')
      }
    } catch (err) {
      setError('Failed to verify code')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center">
                <Icons.logo className="h-12 w-12" />
              </div>
              <CardTitle className="text-center text-2xl">MFA Enabled</CardTitle>
              <CardDescription className="text-center">
                Two-factor authentication has been enabled on your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                Your account is now more secure with two-factor authentication.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push('/dashboard')}>
                Continue to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <Icons.logo className="h-12 w-12" />
            </div>
            <CardTitle className="text-center text-2xl">Multi-Factor Authentication</CardTitle>
            <CardDescription className="text-center">
              {step === 'setup' 
                ? 'Setup two-factor authentication for enhanced security' 
                : 'Verify your authentication app'}
            </CardDescription>
          </CardHeader>
          
          {step === 'setup' ? (
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-4">
                <p>
                  Multi-factor authentication adds an extra layer of security to your account.
                  Scan the QR code with your authenticator app and enter the generated code.
                </p>
                <div className="flex justify-center py-4">
                  {qrCode ? (
                    <img src={qrCode} alt="QR Code" className="h-48 w-48" />
                  ) : (
                    <div className="h-48 w-48 bg-gray-200 flex items-center justify-center">
                      <Icons.spinner className="h-8 w-8 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                />
              </div>
            </CardContent>
          )}
          
          <CardFooter className="flex flex-col space-y-4">
            {step === 'setup' ? (
              <Button className="w-full" onClick={handleSetupMFA} disabled={loading}>
                {loading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Setup MFA'
                )}
              </Button>
            ) : (
              <Button className="w-full" onClick={handleVerifyCode} disabled={loading || code.length !== 6}>
                {loading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Skip for now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}