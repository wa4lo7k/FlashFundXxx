'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  Shield,
  TrendingUp,
  Users,
  Award,
} from 'lucide-react'

function VerifyCodeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyOtp, resendOtp } = useAuth()

  const email = searchParams.get('email') || ''
  const type = (searchParams.get('type') as 'signup' | 'recovery') || 'signup'
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push('/login')
    }
  }, [email, router])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...code]
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i]
    }
    
    setCode(newCode)
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const verificationCode = code.join('')
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await verifyOtp(email, verificationCode, type)

      if (error) {
        setError(error.message)
        return
      }

      setSuccess('Email verified successfully!')
      
      // Redirect based on type
      setTimeout(() => {
        if (type === 'signup') {
          router.push('/dashboard')
        } else {
          router.push(`/new-password?email=${encodeURIComponent(email)}`)
        }
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setError('')
    
    try {
      const { data, error } = await resendOtp(email, type)
      
      if (error) {
        setError(error.message)
        return
      }
      
      setSuccess('Verification code sent! Check your email.')
      setTimeLeft(300) // Reset timer
      setCode(['', '', '', '', '', '']) // Clear code
      
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950" />

        {/* Floating Icons */}
        <div className="absolute top-20 left-10 opacity-[0.04] animate-float">
          <Shield className="w-16 h-16 text-emerald-400" />
        </div>
        <div className="absolute top-1/3 right-10 opacity-[0.05] animate-float">
          <Mail className="w-20 h-20 text-emerald-400" />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-[0.03] animate-float">
          <TrendingUp className="w-24 h-24 text-emerald-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/login"
            className="inline-flex items-center text-slate-400 hover:text-emerald-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>

          <Card className="glass-card border-slate-800/50 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                {type === 'signup' ? 'Verify Your Email' : 'Reset Password'}
              </CardTitle>
              <p className="text-slate-400 font-medium">
                Enter the 6-digit code sent to
              </p>
              <p className="text-emerald-400 font-semibold">{email}</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-400 text-sm font-medium">{success}</p>
                  </div>
                )}

                {/* Code Input */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-300">
                    Verification Code
                  </label>
                  <div className="flex gap-3 justify-center">
                    {code.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="w-12 h-12 text-center text-xl font-bold glass-card border-slate-700/50 text-white"
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                </div>

                {/* Timer */}
                <div className="text-center">
                  <p className="text-slate-400 text-sm">
                    Code expires in: <span className="text-emerald-400 font-mono">{formatTime(timeLeft)}</span>
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || code.join('').length !== 6}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Code
                    </div>
                  )}
                </Button>

                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-2">Didn't receive the code?</p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResend}
                    disabled={isResending || timeLeft > 240} // Allow resend after 1 minute
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                  >
                    {isResending ? (
                      <div className="flex items-center">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      'Resend Code'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400">Secure</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400">Trusted</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400">Professional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <VerifyCodeContent />
    </Suspense>
  )
}
