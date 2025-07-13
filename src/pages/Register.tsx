import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from 'react-query'
import { toast } from 'react-hot-toast'
import { registerUser } from '~/apis/auth.api'
import { useContext } from 'react'
import { AppContext } from '~/contexts/app.context'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface RegisterErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const Register: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return t('name_required')
    if (name.length < 2) return t('name_min_length')
    if (name.length > 50) return t('name_max_length')
    return undefined
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return t('email_required')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return t('email_invalid')
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return t('password_required')
    if (password.length < 6) return t('password_min_length')
    return undefined
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return t('confirm_password_required')
    if (password !== confirmPassword) return t('passwords_not_match')
    return undefined
  }

  // Real-time validation
  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // Real-time validation
    let error: string | undefined
    switch (field) {
      case 'name':
        error = validateName(value)
        break
      case 'email':
        error = validateEmail(value)
        break
      case 'password':
        error = validatePassword(value)
        break
      case 'confirmPassword':
        error = validateConfirmPassword(formData.password, value)
        break
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {}
    
    newErrors.name = validateName(formData.name)
    newErrors.email = validateEmail(formData.email)
    newErrors.password = validatePassword(formData.password)
    newErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword)
    
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const response = await registerUser(data)
      return response
    },
    onSuccess: (response) => {
      toast.success(t('registration_successful'))
      
      // Auto login after registration
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)
        setIsAuthenticated(true)
        setProfile({ ...response.user, username: response.user.name })
        navigate('/')
      }
    },
    onError: (error: any) => {
      console.error('Registration error:', error)
      
      let errorMessage = t('registration_failed')
      
      if (error?.response?.status === 409) {
        errorMessage = t('email_already_exists')
        setErrors(prev => ({ ...prev, email: t('email_already_exists') }))
      } else if (error?.response?.status === 400) {
        errorMessage = t('invalid_registration_data')
        
        // Handle validation errors from server
        if (error?.response?.data?.details) {
          const serverErrors: RegisterErrors = {}
          error.response.data.details.forEach((detail: any) => {
            if (detail.field === 'email') {
              serverErrors.email = detail.message
            } else if (detail.field === 'password') {
              serverErrors.password = detail.message
            } else if (detail.field === 'name') {
              serverErrors.name = detail.message
            }
          })
          setErrors(prev => ({ ...prev, ...serverErrors }))
        }
      }
      
      toast.error(errorMessage)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error(t('please_fix_errors'))
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await registerMutation.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      })
    } catch (error) {
      // Error is handled in mutation
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Logo */}
      <div className="mb-8">
        <svg
          width="70"
          height="70"
          viewBox="0 0 72 72"
          fill="rgba(0, 0, 0, 0.35)"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.6276 20.2241C16.6276 30.8074 25.2394 39.4192 35.8227 39.4192C46.4059 39.4192 55.0178 30.8074 55.0178 20.2241C55.0178 9.64086 46.4059 1.02899 35.8227 1.02899C25.2394 1.02899 16.6276 9.64086 16.6276 20.2241ZM19.7405 20.2244C19.7405 11.3583 26.9568 4.14202 35.8229 4.14202C44.689 4.14202 51.9053 11.3583 51.9053 20.2244C51.9053 29.0905 44.689 36.3068 35.8229 36.3068C26.9568 36.3068 19.7405 29.0905 19.7405 20.2244Z"
          />
          <path d="M6.69813 70.9717C6.56844 70.9717 6.43874 70.9562 6.30904 70.9199C5.47898 70.7072 4.97576 69.8563 5.19365 69.0263C8.79922 55.045 21.3954 45.2762 35.8228 45.2762C50.2503 45.2762 62.8465 55.0398 66.4572 69.0211C66.6699 69.8512 66.1719 70.702 65.3366 70.9147C64.5014 71.1326 63.6558 70.6293 63.4379 69.7941C60.1851 57.1876 48.8288 48.3837 35.8176 48.3837C22.8117 48.3837 11.4554 57.1876 8.19743 69.7941C8.02104 70.5048 7.39331 70.9717 6.69813 70.9717Z" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {t('create_account')}
      </h1>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 text-center">
        {t('register_subtitle')}
      </p>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        {/* Name Field */}
        <div>
          <input
            type="text"
            placeholder={t('full_name')}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <input
            type="email"
            placeholder={t('email')}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <input
            type="password"
            placeholder={t('password')}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <input
            type="password"
            placeholder={t('confirm_password')}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || registerMutation.isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
        >
          {isSubmitting || registerMutation.isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('creating_account')}
            </>
          ) : (
            t('create_account')
          )}
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
        {t('already_have_account')}{' '}
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          {t('login')}
        </Link>
      </p>
    </div>
  )
}

export default Register
