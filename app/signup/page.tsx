"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

// Comprehensive country data with codes and phone prefixes
const COUNTRIES_DATA = [
  // Popular countries first
  { name: "United States", code: "US", phone: "+1" },
  { name: "United Kingdom", code: "GB", phone: "+44" },
  { name: "Canada", code: "CA", phone: "+1" },
  { name: "Australia", code: "AU", phone: "+61" },
  { name: "Germany", code: "DE", phone: "+49" },
  { name: "France", code: "FR", phone: "+33" },
  { name: "Singapore", code: "SG", phone: "+65" },
  { name: "Hong Kong", code: "HK", phone: "+852" },
  { name: "Japan", code: "JP", phone: "+81" },
  { name: "India", code: "IN", phone: "+91" },
  // Alphabetical list of all other countries
  { name: "Afghanistan", code: "AF", phone: "+93" },
  { name: "Albania", code: "AL", phone: "+355" },
  { name: "Algeria", code: "DZ", phone: "+213" },
  { name: "Andorra", code: "AD", phone: "+376" },
  { name: "Angola", code: "AO", phone: "+244" },
  { name: "Argentina", code: "AR", phone: "+54" },
  { name: "Armenia", code: "AM", phone: "+374" },
  { name: "Austria", code: "AT", phone: "+43" },
  { name: "Azerbaijan", code: "AZ", phone: "+994" },
  { name: "Bahrain", code: "BH", phone: "+973" },
  { name: "Bangladesh", code: "BD", phone: "+880" },
  { name: "Belarus", code: "BY", phone: "+375" },
  { name: "Belgium", code: "BE", phone: "+32" },
  { name: "Bolivia", code: "BO", phone: "+591" },
  { name: "Bosnia and Herzegovina", code: "BA", phone: "+387" },
  { name: "Brazil", code: "BR", phone: "+55" },
  { name: "Bulgaria", code: "BG", phone: "+359" },
  { name: "Cambodia", code: "KH", phone: "+855" },
  { name: "Chile", code: "CL", phone: "+56" },
  { name: "China", code: "CN", phone: "+86" },
  { name: "Colombia", code: "CO", phone: "+57" },
  { name: "Croatia", code: "HR", phone: "+385" },
  { name: "Cyprus", code: "CY", phone: "+357" },
  { name: "Czech Republic", code: "CZ", phone: "+420" },
  { name: "Denmark", code: "DK", phone: "+45" },
  { name: "Ecuador", code: "EC", phone: "+593" },
  { name: "Egypt", code: "EG", phone: "+20" },
  { name: "Estonia", code: "EE", phone: "+372" },
  { name: "Finland", code: "FI", phone: "+358" },
  { name: "Georgia", code: "GE", phone: "+995" },
  { name: "Greece", code: "GR", phone: "+30" },
  { name: "Hungary", code: "HU", phone: "+36" },
  { name: "Iceland", code: "IS", phone: "+354" },
  { name: "Indonesia", code: "ID", phone: "+62" },
  { name: "Ireland", code: "IE", phone: "+353" },
  { name: "Israel", code: "IL", phone: "+972" },
  { name: "Italy", code: "IT", phone: "+39" },
  { name: "Jordan", code: "JO", phone: "+962" },
  { name: "Kazakhstan", code: "KZ", phone: "+7" },
  { name: "Kenya", code: "KE", phone: "+254" },
  { name: "Kuwait", code: "KW", phone: "+965" },
  { name: "Latvia", code: "LV", phone: "+371" },
  { name: "Lebanon", code: "LB", phone: "+961" },
  { name: "Lithuania", code: "LT", phone: "+370" },
  { name: "Luxembourg", code: "LU", phone: "+352" },
  { name: "Malaysia", code: "MY", phone: "+60" },
  { name: "Malta", code: "MT", phone: "+356" },
  { name: "Mexico", code: "MX", phone: "+52" },
  { name: "Morocco", code: "MA", phone: "+212" },
  { name: "Netherlands", code: "NL", phone: "+31" },
  { name: "New Zealand", code: "NZ", phone: "+64" },
  { name: "Nigeria", code: "NG", phone: "+234" },
  { name: "Norway", code: "NO", phone: "+47" },
  { name: "Pakistan", code: "PK", phone: "+92" },
  { name: "Peru", code: "PE", phone: "+51" },
  { name: "Philippines", code: "PH", phone: "+63" },
  { name: "Poland", code: "PL", phone: "+48" },
  { name: "Portugal", code: "PT", phone: "+351" },
  { name: "Qatar", code: "QA", phone: "+974" },
  { name: "Romania", code: "RO", phone: "+40" },
  { name: "Russia", code: "RU", phone: "+7" },
  { name: "Saudi Arabia", code: "SA", phone: "+966" },
  { name: "Serbia", code: "RS", phone: "+381" },
  { name: "Slovakia", code: "SK", phone: "+421" },
  { name: "Slovenia", code: "SI", phone: "+386" },
  { name: "South Africa", code: "ZA", phone: "+27" },
  { name: "South Korea", code: "KR", phone: "+82" },
  { name: "Spain", code: "ES", phone: "+34" },
  { name: "Sri Lanka", code: "LK", phone: "+94" },
  { name: "Sweden", code: "SE", phone: "+46" },
  { name: "Switzerland", code: "CH", phone: "+41" },
  { name: "Taiwan", code: "TW", phone: "+886" },
  { name: "Thailand", code: "TH", phone: "+66" },
  { name: "Turkey", code: "TR", phone: "+90" },
  { name: "Ukraine", code: "UA", phone: "+380" },
  { name: "United Arab Emirates", code: "AE", phone: "+971" },
  { name: "Uruguay", code: "UY", phone: "+598" },
  { name: "Venezuela", code: "VE", phone: "+58" },
  { name: "Vietnam", code: "VN", phone: "+84" },
]

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
  const [filteredCountries, setFilteredCountries] = useState(COUNTRIES_DATA)
  const [countrySearchTerm, setCountrySearchTerm] = useState("")

  // Auto-detect country from phone number
  const detectCountryFromPhone = (phoneNumber: string) => {
    // Remove all non-digit characters except +
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '')

    if (!cleanPhone.startsWith('+')) return null

    // Common country code patterns (ordered by specificity)
    const countryCodeMap = [
      { codes: ['+1'], countries: ['United States', 'Canada'] }, // Default to US for +1
      { codes: ['+44'], countries: ['United Kingdom'] },
      { codes: ['+49'], countries: ['Germany'] },
      { codes: ['+33'], countries: ['France'] },
      { codes: ['+39'], countries: ['Italy'] },
      { codes: ['+34'], countries: ['Spain'] },
      { codes: ['+31'], countries: ['Netherlands'] },
      { codes: ['+32'], countries: ['Belgium'] },
      { codes: ['+41'], countries: ['Switzerland'] },
      { codes: ['+43'], countries: ['Austria'] },
      { codes: ['+45'], countries: ['Denmark'] },
      { codes: ['+46'], countries: ['Sweden'] },
      { codes: ['+47'], countries: ['Norway'] },
      { codes: ['+48'], countries: ['Poland'] },
      { codes: ['+61'], countries: ['Australia'] },
      { codes: ['+65'], countries: ['Singapore'] },
      { codes: ['+81'], countries: ['Japan'] },
      { codes: ['+82'], countries: ['South Korea'] },
      { codes: ['+86'], countries: ['China'] },
      { codes: ['+91'], countries: ['India'] },
      { codes: ['+852'], countries: ['Hong Kong'] },
      { codes: ['+886'], countries: ['Taiwan'] },
      { codes: ['+971'], countries: ['United Arab Emirates'] },
      { codes: ['+966'], countries: ['Saudi Arabia'] },
      { codes: ['+7'], countries: ['Russia', 'Kazakhstan'] }, // Default to Russia for +7
    ]

    // Find matching country code
    for (const mapping of countryCodeMap) {
      for (const code of mapping.codes) {
        if (cleanPhone.startsWith(code)) {
          // For codes with multiple countries, default to first one
          return mapping.countries[0]
        }
      }
    }

    return null
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-detect country from phone number
    if (field === 'phone' && typeof value === 'string') {
      const detectedCountry = detectCountryFromPhone(value)
      if (detectedCountry && detectedCountry !== prev.country) {
        setFormData((current) => ({ ...current, [field]: value, country: detectedCountry }))
        return
      }
    }
  }

  // Filter countries based on search
  useEffect(() => {
    if (!countrySearchTerm) {
      setFilteredCountries(COUNTRIES_DATA)
    } else {
      const filtered = COUNTRIES_DATA.filter(country =>
        country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
        country.phone.includes(countrySearchTerm)
      )
      setFilteredCountries(filtered)
    }
  }, [countrySearchTerm])

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
                          placeholder="e.g., +1 555 123 4567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 pl-12 h-12 font-medium"
                          required
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Include country code (e.g., +1, +44, +91) for automatic country detection
                      </p>
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
                        <SelectContent className="glass border-slate-700/50 bg-slate-900 max-h-60">
                          {/* Search input for filtering countries */}
                          <div className="p-2 border-b border-slate-700/50">
                            <Input
                              placeholder="Search countries..."
                              value={countrySearchTerm}
                              onChange={(e) => setCountrySearchTerm(e.target.value)}
                              className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 h-8 text-xs"
                            />
                          </div>
                          {filteredCountries.map((country) => (
                            <SelectItem
                              key={country.code}
                              value={country.name}
                              className="text-white hover:bg-slate-800 flex items-center justify-between"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{country.name}</span>
                                <span className="text-slate-400 text-xs ml-2">{country.phone}</span>
                              </div>
                            </SelectItem>
                          ))}
                          {filteredCountries.length === 0 && (
                            <div className="p-2 text-slate-400 text-sm text-center">
                              No countries found
                            </div>
                          )}
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
                    <div className="text-xs text-slate-400">Trained Students</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-teal-500/20">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-teal-400" />
                  <div>
                    <div className="text-lg font-bold text-white">$850K+</div>
                    <div className="text-xs text-slate-400">Training Rewards</div>
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
