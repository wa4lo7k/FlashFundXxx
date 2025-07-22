"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Globe,
} from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreeMarketing: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    // Check all required fields
    if (!formData.firstName.trim()) {
      setError("First name is required")
      return false
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required")
      return false
    }
    if (!formData.country) {
      setError("Country is required")
      return false
    }
    if (!formData.password) {
      setError("Password is required")
      return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (!formData.agreeTerms) {
      setError("You must agree to the Terms and Conditions")
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        country: formData.country,
        marketing_consent: formData.agreeMarketing
      })

      if (error) {
        console.error('Signup error:', error)

        // Handle rate limiting specially
        if (error.isRateLimit || error.message.includes('rate') || error.message.includes('limit')) {
          setError(`⏰ Email sending is temporarily rate limited. Your account was created successfully, but we can't send the verification email right now. Please contact support at support@flashfundx.com for manual verification, or try again in 10-15 minutes.`)
        } else {
          setError(`Signup failed: ${error.message}`)
        }
        return
      }

      console.log('Signup successful:', data)

      // Check if user needs email confirmation
      if (data.user && !data.user.email_confirmed_at) {
        setSuccess("Account created! Please check your email for the 6-digit verification code.")

        // Redirect to code verification page after 2 seconds
        setTimeout(() => {
          router.push(`/verify-code?email=${encodeURIComponent(formData.email)}&type=signup`)
        }, 2000)
      } else {
        // User is already confirmed, redirect to dashboard
        setSuccess("Account created successfully!")
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Singapore",
    "Hong Kong",
    "Japan",
    "Other",
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950" />

        {/* Trading Chart Background */}
        <div className="absolute top-20 left-10 opacity-[0.04] animate-float">
          <svg width="300" height="200" viewBox="0 0 300 200" className="text-teal-400">
            <defs>
              <linearGradient id="signupChartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Candlestick pattern */}
            <rect x="30" y="80" width="8" height="40" fill="currentColor" opacity="0.3" />
            <rect x="50" y="60" width="8" height="60" fill="currentColor" opacity="0.3" />
            <rect x="70" y="90" width="8" height="30" fill="currentColor" opacity="0.3" />
            <rect x="90" y="50" width="8" height="70" fill="currentColor" opacity="0.3" />
            <rect x="110" y="70" width="8" height="50" fill="currentColor" opacity="0.3" />
          </svg>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/3 right-10 opacity-[0.05] animate-float">
          <Globe className="w-16 h-16 text-teal-400" />
        </div>
        <div className="absolute bottom-1/4 left-20 opacity-[0.05] animate-float" style={{ animationDelay: "3s" }}>
          <Award className="w-14 h-14 text-emerald-400" />
        </div>

        {/* Subtle gradients */}
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-teal-950/[0.02] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-950/[0.02] to-transparent" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Signup Form */}
        <div className="w-full lg:w-2/3 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link href="/" className="inline-block group">
                <Image
                  src="/250 1.svg"
                  alt="FlashFundX"
                  width={195}
                  height={126}
                  className="h-10 w-auto transition-all duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            <Card className="glass border-slate-800/30 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold text-white mb-2">Create Your Trading Account</CardTitle>
                <p className="text-slate-400 font-medium">
                  Join thousands of successful traders and get instant access to funding
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
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

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-semibold text-slate-300">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 pl-12 h-12 font-medium"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-semibold text-slate-300">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 pl-12 h-12 font-medium"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 pl-12 h-12 font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Country */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-semibold text-slate-300">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 pl-12 h-12 font-medium"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="country" className="text-sm font-semibold text-slate-300">
                        Country
                      </label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                        <SelectTrigger className="glass-card border-slate-700/50 text-white h-12 font-medium">
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-slate-400" />
                            <SelectValue placeholder="Select your country" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="glass border-slate-700/50 bg-slate-900">
                          {countries.map((country) => (
                            <SelectItem key={country} value={country} className="text-white hover:bg-slate-800">
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-semibold text-slate-300">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create password (min 8 characters)"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 pl-12 pr-12 h-12 font-medium"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-300">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 pl-12 pr-12 h-12 font-medium"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeTerms", checked)}
                        className="border-slate-600 mt-1"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-slate-400 font-medium leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="marketing"
                        checked={formData.agreeMarketing}
                        onCheckedChange={(checked) => handleInputChange("agreeMarketing", checked)}
                        className="border-slate-600 mt-1"
                      />
                      <label htmlFor="marketing" className="text-sm text-slate-400 font-medium leading-relaxed">
                        I would like to receive trading insights, market updates, and promotional offers via email
                      </label>
                    </div>
                  </div>

                  {/* Create Account Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.agreeTerms}
                    className="w-full gradient-primary shadow-glow-emerald text-white font-semibold h-12 hover:scale-105 transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Sign In Link */}
                <div className="text-center pt-4 border-t border-slate-800/30">
                  <p className="text-slate-400 font-medium">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <Badge className="glass-card text-emerald-300 border-emerald-500/30 font-medium">
                <Shield className="w-3 h-3 mr-2" />
                Your data is protected with 256-bit SSL encryption
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Side - Benefits & Info */}
        <div className="hidden lg:flex lg:w-1/3 flex-col justify-center p-12 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
          <div className="max-w-sm">
            {/* Logo */}
            <div className="mb-8">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                  <Image
                    src="/250 1.svg"
                    alt="FlashFundX"
                    width={40}
                    height={26}
                    className="w-8 h-auto"
                  />
                </div>
                <span className="text-xl font-bold text-gradient-primary">FlashFundX</span>
              </Link>
            </div>

            {/* Benefits */}
            <h2 className="text-2xl font-bold mb-6 text-white">Join the Elite Trading Community</h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Instant Funding</h3>
                  <p className="text-sm text-slate-400">Get funded immediately with no evaluation required</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 gradient-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Professional Support</h3>
                  <p className="text-sm text-slate-400">24/7 expert support from our trading specialists</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Up to 90% Profit Split</h3>
                  <p className="text-sm text-slate-400">Keep up to 90% of your trading profits</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-xl border border-emerald-500/20">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-emerald-400" />
                  <div>
                    <div className="text-lg font-bold text-white">15,000+</div>
                    <div className="text-xs text-slate-400">Funded Traders</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-teal-500/20">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-teal-400" />
                  <div>
                    <div className="text-lg font-bold text-white">$850K+</div>
                    <div className="text-xs text-slate-400">Total Payouts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
