'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, verifyOtp, clearError, setTempCredentials } from '@/features/auth/authSlice';
import { verificationAPI } from '@/lib/verificationApi';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import AuthRedirect from './AuthRedirect';

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, otpSent } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'user',
    panCard: '',
    aadharCard: '',
    businessName: '',
    businessAddress: '',
    gstNumber: '',
    adminCode: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const [otpCode, setOtpCode] = useState('');

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Name validation (only alphabets)
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = 'Name should contain only alphabets';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (10 digits and should not start with 0)
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    } else if (formData.phone.startsWith('0')) {
      errors.phone = 'Phone number should not start with 0';
    }
    
    // Password validation (strong password)
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Aadhar card validation (12 digits)
    if (!formData.aadharCard.trim()) {
      errors.aadharCard = 'Aadhar card number is required';
    } else if (!/^\d{12}$/.test(formData.aadharCard)) {
      errors.aadharCard = 'Aadhar card number must be exactly 12 digits';
    }
    
    // PAN card validation (for vendors only)
    if (formData.userType === 'vendor') {
      if (!formData.panCard.trim()) {
        errors.panCard = 'PAN card number is required for vendors';
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard)) {
        errors.panCard = 'PAN card number must be in format: ABCDE1234F';
      }
      
      // Business name validation
      if (!formData.businessName.trim()) {
        errors.businessName = 'Business name is required for vendors';
      }
      
      // Business address validation
      if (!formData.businessAddress.trim()) {
        errors.businessAddress = 'Business address is required for vendors';
      }
      
      // GST number validation (optional but if provided, should be valid)
      if (formData.gstNumber.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
        errors.gstNumber = 'GST number must be in valid format';
      }
    }
    
    return errors;
  };

const handleVerification = async () => {
    const aadharResponse = await verificationAPI.verifyAadhar(formData.aadharCard);

    if (!aadharResponse.valid) {
      setValidationErrors(prevErrors => ({ ...prevErrors, aadharCard: aadharResponse.message }));
      return false;
    }

    if (formData.userType === 'vendor') {
      const panResponse = await verificationAPI.verifyPan(formData.panCard);

      if (!panResponse.valid) {
        setValidationErrors(prevErrors => ({ ...prevErrors, panCard: panResponse.message }));
        return false;
      }
    }

    return true;
  };

const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Clear previous errors
      setValidationErrors({});
      dispatch(clearError());
      
      // Skip API verification, use only client-side validation
      const errors = validateForm();
      setValidationErrors(errors);
      
      if (Object.keys(errors).length > 0) {
        console.log('Validation errors:', errors);
        return;
      }
      
      // Store credentials for OTP verification
      dispatch(setTempCredentials({
        emailOrPhone: formData.email,
        password: formData.password,
      }));

      const registerData: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.userType.toUpperCase(), // Convert to uppercase for backend
        userType: formData.userType,
      };
      
      // Add admin code if registering as admin
      if (formData.userType === 'admin') {
        registerData.adminCode = formData.adminCode;
      }
      
      if (formData.userType === 'vendor') {
        registerData.panNumber = formData.panCard.trim(); // PAN card for vendors
        registerData.businessName = formData.businessName.trim();
        registerData.businessAddress = formData.businessAddress.trim();
        if (formData.gstNumber.trim()) {
          registerData.gstNumber = formData.gstNumber.trim();
        }
      }
      
      console.log('Sending registration data:', registerData);
      
      const result = await dispatch(register(registerData));
      
      if (register.fulfilled.match(result)) {
        console.log('Registration successful, OTP sent');
        // OTP sent, show OTP form
      } else if (register.rejected.match(result)) {
        console.error('Registration failed:', result.payload);
        // Error will be handled by the reducer
      }
    } catch (error) {
      console.error('Registration error:', error);
      setValidationErrors({ general: 'Registration failed. Please try again.' });
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(verifyOtp({
      emailOrPhone: formData.email,
      otp: otpCode,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Real-time validation
    const newErrors: {[key: string]: string} = {};
    
    if (name === 'name' && value && !/^[a-zA-Z\s]+$/.test(value)) {
      newErrors.name = 'Name should contain only alphabets';
    }
    
    if (name === 'confirmPassword' && value && formData.password !== value) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (name === 'phone' && value) {
      if (!/^\d{10}$/.test(value)) {
        newErrors.phone = 'Phone number must be exactly 10 digits';
      } else if (value.startsWith('0')) {
        newErrors.phone = 'Phone number should not start with 0';
      }
    }
    
    if (name === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (name === 'aadharCard' && value) {
      if (!/^\d{12}$/.test(value) && value.length === 12) {
        newErrors.aadharCard = 'Aadhar card number must be exactly 12 digits';
      } else if (value.length === 12 && /^([0-9])\1{11}$/.test(value)) {
        newErrors.aadharCard = 'Invalid Aadhar: Cannot have all identical digits';
      }
    }
    
    
    setValidationErrors(prev => ({ ...prev, ...newErrors }));
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);


  if (otpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verify OTP
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter the OTP sent to {formData.email}
            </p>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 text-center">
                📧 <strong>Note:</strong> If you haven't received the OTP email, you can use <strong>123456</strong> for testing.
              </p>
            </div>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleOtpVerification}>
            <div>
              <Input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter OTP"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <Button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our B2B marketplace
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <Input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name (alphabets only)"
                required
                autoComplete="name"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>
            
            <div>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address (example@gmail.com)"
                required
                autoComplete="email"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>
            
            <div>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (10 digits, not starting with 0)"
                required
                maxLength={10}
                autoComplete="tel"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
              )}
            </div>
            
            <div>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="user">User (Buyer)</option>
                <option value="vendor">Vendor (Seller)</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div>
              <Input
                name="aadharCard"
                type="text"
                value={formData.aadharCard}
                onChange={handleChange}
                placeholder="Aadhar Card Number (12 digits)"
                required
                maxLength={12}
                autoComplete="off"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.aadharCard ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.aadharCard && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.aadharCard}</p>
              )}
            </div>
            
            {formData.userType === 'admin' && (
              <div>
                <Input
                  name="adminCode"
                  type="text"
                  value={formData.adminCode}
                  onChange={handleChange}
                  placeholder="Admin Access Code"
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.adminCode ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                />
                <p className="mt-1 text-xs text-gray-500">Admin access code is required for admin registration</p>
                {validationErrors.adminCode && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.adminCode}</p>
                )}
              </div>
            )}
            
            {formData.userType === 'vendor' && (
              <>
                <div>
                  <Input
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Business Name"
                    required
                    autoComplete="organization"
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.businessName ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  />
                  {validationErrors.businessName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.businessName}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    name="businessAddress"
                    type="text"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    placeholder="Business Address"
                    required
                    autoComplete="street-address"
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.businessAddress ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  />
                  {validationErrors.businessAddress && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.businessAddress}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    name="panCard"
                    type="text"
                    value={formData.panCard}
                    onChange={handleChange}
                    placeholder="PAN Card Number (ABCDE1234F)"
                    required
                    maxLength={10}
                    autoComplete="off"
                    style={{ textTransform: 'uppercase' }}
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.panCard ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  />
                  {validationErrors.panCard && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.panCard}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    name="gstNumber"
                    type="text"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="GST Number (Optional)"
                    maxLength={15}
                    autoComplete="off"
                    style={{ textTransform: 'uppercase' }}
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.gstNumber ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  />
                  {validationErrors.gstNumber && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.gstNumber}</p>
                  )}
                </div>
              </>
            )}
            
            <div>
<Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (min 8 chars, strong)"
                required
                autoComplete="new-password"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>
            
            <div>
<Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                autoComplete="new-password"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {(error || validationErrors.general) && (
            <div className="text-red-600 text-sm text-center">
              {error || validationErrors.general}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
