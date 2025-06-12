"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail } from "lucide-react"
// TODO: Get google and X logo new
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import axios from "axios"

export default function SignupPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Add actual signup logic
    console.log("Form submitted:", formData)

    // Basic validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("All fields are required")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    const res = await axios.post("/api/auth/signup", formData)
    if (res.status === 201) {
      toast.success("Signup successful! Please check your email to confirm.")
    } else {
      toast.error("Signup failed. Please try again.")
      console.error("Signup error:", res.data)
    }

    // router.replace("/welcome") // Will handle profile setup. Include username pickup and avatar upload. Can be skipped. If skipped, default random avatar and username will be assigned.
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Left Side - Branding & Warning */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark-secondary flex-col justify-center px-12">
        <div className="max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-light">
              S<strike className="text-accent no-underline">in</strike>kedIn
            </h1>
            <p className="text-light-secondary mt-2 text-lg">
              Where careers go to die (and get roasted)
            </p>
          </div>

          {/* Warning Box */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="text-accent mr-3 mt-1">⚠️</div>
              <div>
                <h3 className="text-red-400 font-semibold mb-2">
                  Fair Warning
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This is a space for sharing your job market fails in a
                  humorous way. Expect snark, memes, and a lot of roasting. If
                  you can't handle brutal honesty about career disasters, this
                  isn't the place for you.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center text-gray-300">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <span className="text-sm">Share your epic interview fails</span>
            </div>
            <div className="flex items-center text-gray-300">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <span className="text-sm">Get roasted by fellow failures</span>
            </div>
            <div className="flex items-center text-gray-300">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <span className="text-sm">Laugh at others' career disasters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-light">
              S<strike className="text-accent no-underline">in</strike>kedIn
            </h1>
            <p className="text-light-secondary mt-1">Where careers go to die</p>
          </div>

          <div className="bg-dark-secondary border border-dark-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-light mb-6 text-center">
              Join the Chaos
            </h2>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button className="w-full py-3 px-4 rounded-lg flex items-center justify-center transition-colors border hover:opacity-80 bg-dark border-dark-border text-light">
                <Mail className="w-5 h-5 mr-2" />
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-grow border-t border-dark-border"></div>
              <span className="px-4 text-light-secondary text-sm">or</span>
              <div className="flex-grow border-t border-dark-border"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-dark border border-dark-border text-light px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="your.email@disaster.com"
                    // required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-dark border border-dark-border text-light px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors pr-12"
                      placeholder="Make it strong (unlike your career)"
                      // required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-secondary hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-dark border border-dark-border text-light px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    placeholder="Double-check (like you should've your resume)"
                    // required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Join the Disaster
                </button>
              </div>
            </form>

            {/* Terms */}
            <div className="mt-6 text-center">
              <p className="text-xs text-light-secondary">
                By joining, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-red-400 hover:text-red-300 underline"
                >
                  Terms of Service{" "}
                </Link>
                and{" "}
                <Link
                  href="/privacy"
                  className="text-red-400 hover:text-red-300 underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-light-secondary text-sm">
                Already failed here before?{" "}
                <Link
                  href="/auth/login"
                  className="text-red-400 hover:text-red-300 font-medium"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
