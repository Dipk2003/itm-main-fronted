'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerVendor, verifyOTP, clearError, setTempCredentials } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

export default function VendorRegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  // Multi-step registration state
  const [step, setStep] = useState<'registration' | 'documents' | 'otp'>('registration');
  const [vendorId, setVendorId] = useState<number | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessAddress: '',
    city: '',
    state: '',
    pincode: '',
    panCard: '',
    gstNumber: '',
  });
  
  const [kycDocuments, setKycDocuments] = useState<{
    panCardFile: File | null;
    gstCertificate: File | null;
    businessRegistration: File | null;
    bankStatement: File | null;
  }>({
    panCardFile: null,
    gstCertificate: null,
    businessRegistration: null,
    bankStatement: null,
  });
  
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

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
    
    // Phone validation (10 digits)
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
    
    // Business name validation (required for vendors)
    if (!formData.businessName.trim()) {
      errors.businessName = 'Business name is required for vendors';
    }
    
    // Business address validation
    if (!formData.businessAddress.trim()) {
      errors.businessAddress = 'Business address is required for vendors';
    }
    
    // City validation
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    // State validation
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    
    // Pincode validation
    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Pincode must be exactly 6 digits';
    }
    
    // PAN card validation (for vendors only)
    if (!formData.panCard.trim()) {
      errors.panCard = 'PAN card number is required for vendors';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard)) {
      errors.panCard = 'PAN card number must be in format: ABCDE1234F';
    }
    
    // GST validation (optional but if provided should be valid)
    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      errors.gstNumber = 'Invalid GST format';
    }
    
    return errors;
  };

  // FIXED: Vendor registration handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) return;

    // Store credentials for OTP verification
    dispatch(setTempCredentials({
      emailOrPhone: formData.email,
      password: formData.password,
    }));

    // FIXED: Use vendor-specific registration data structure
    const vendorRegistrationData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      businessName: formData.businessName,
      businessAddress: formData.businessAddress,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      panNumber: formData.panCard, // Map to panNumber field
      gstNumber: formData.gstNumber || undefined,
    };

    const result = await dispatch(registerVendor(vendorRegistrationData));
    
    if (registerVendor.fulfilled.match(result)) {
      console.log('✅ Vendor registration successful');
      // Move to document upload step
      setStep('documents');
    }
  };

  // FIXED: Document upload handler (after vendor registration)
  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📁 Starting document upload process...');
    
    // For now, proceed to OTP step even without documents
    // In a complete implementation, you would upload documents here
    // and get the vendor ID from the registration response
    
    setStep('otp');
    setOtpSent(true);
    
    // TODO: Implement actual document upload to vendor after getting vendor ID
    // This would require getting the vendor ID from registration response
    // and calling /api/vendors/{vendorId}/documents endpoints
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await dispatch(verifyOTP({
      emailOrPhone: formData.email,
      otp: otpCode,
    }));
    
    if (verifyOTP.fulfilled.match(result)) {
      console.log('✅ OTP verified successfully for vendor');
      console.log('🔄 Redirecting to vendor dashboard...');
      // Redirect to vendor dashboard
      window.location.href = '/dashboard/vendor-panel';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
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

  // STEP 1: Registration Form
  if (step === 'registration') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create Vendor Account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Register as a vendor in our B2B marketplace
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div>
                <Input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name (alphabets only)"
                  required
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
                  placeholder="Email Address"
                  required
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
                  placeholder="Phone Number (10 digits)"
                  required
                  maxLength={10}
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>
              
              {/* Business Information */}
              <div>
                <Input
                  name="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Business Name"
                  required
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
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.businessAddress ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                />
                {validationErrors.businessAddress && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.businessAddress}</p>
                )}
              </div>
              
              <div>
                <Input
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.city ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                />
                {validationErrors.city && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
                )}
              </div>
              
              <div>
                <Input
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.state ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                />
                {validationErrors.state && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
                )}
              </div>
              
              <div>
                <Input
                  name="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode (6 digits)"
                  required
                  maxLength={6}
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.pincode ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                />
                {validationErrors.pincode && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.pincode}</p>
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
                  style={{ textTransform: 'uppercase' }}
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.gstNumber ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                />
                {validationErrors.gstNumber && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.gstNumber}</p>
                )}
              </div>
              
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

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Creating Account...' : 'Continue to Document Upload'}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/auth/vendor/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // STEP 2: Document Upload
  if (step === 'documents') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Upload Documents
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Upload your KYC documents for verification
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleDocumentUpload}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card *</label>
                <input
                  type="file"
                  name="panCardFile"
                  accept="image/*,.pdf"
                  onChange={(e) => setKycDocuments({ ...kycDocuments, panCardFile: e.target.files?.[0] || null })}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {kycDocuments.panCardFile && (
                  <p className="mt-1 text-xs text-green-600">✓ {kycDocuments.panCardFile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Certificate</label>
                <input
                  type="file"
                  name="gstCertificate"
                  accept="image/*,.pdf"
                  onChange={(e) => setKycDocuments({ ...kycDocuments, gstCertificate: e.target.files?.[0] || null })}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {kycDocuments.gstCertificate && (
                  <p className="mt-1 text-xs text-green-600">✓ {kycDocuments.gstCertificate.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration</label>
                <input
                  type="file"
                  name="businessRegistration"
                  accept="image/*,.pdf"
                  onChange={(e) => setKycDocuments({ ...kycDocuments, businessRegistration: e.target.files?.[0] || null })}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {kycDocuments.businessRegistration && (
                  <p className="mt-1 text-xs text-green-600">✓ {kycDocuments.businessRegistration.name}</p>
                )}
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>• Accepted formats: JPG, PNG, PDF (Max 10MB each)</p>
              <p>• Documents will be verified by our team within 24-48 hours</p>
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
                {loading ? 'Processing...' : 'Continue to Verification'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // STEP 3: OTP Verification
  if (step === 'otp' || otpSent) {
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

  return null;
}
