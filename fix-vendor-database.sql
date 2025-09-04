-- =====================================================
-- iTech Marketplace - Vendor Role Fix SQL Script
-- =====================================================
-- This script fixes the vendor role issue for existing users

-- 1. Check current user roles
SELECT 
    id, 
    email, 
    first_name, 
    last_name, 
    role, 
    user_type,
    is_active,
    is_verified,
    created_at
FROM users 
WHERE email IN ('mishra@gmail.com', 'testvendor@example.com')
ORDER BY created_at DESC;

-- 2. Update existing user to vendor role
UPDATE users 
SET 
    role = 'ROLE_VENDOR',
    user_type = 'vendor',
    updated_at = NOW()
WHERE email = 'mishra@gmail.com';

-- 3. Create a test vendor account if it doesn't exist
INSERT IGNORE INTO users (
    email,
    password,
    first_name,
    last_name,
    phone_number,
    role,
    user_type,
    is_active,
    is_verified,
    created_at,
    updated_at
) VALUES (
    'testvendor@itechmart.com',
    '$2a$10$N.zmdr9k7uOsaQIW6.NWHOmrfLkPCw1J6tHv7qQ8QqSz1Cr2z/fO6', -- password: vendor123
    'Test',
    'Vendor',
    '9876543210',
    'ROLE_VENDOR',
    'vendor',
    1,
    1,
    NOW(),
    NOW()
);

-- 4. Verify the changes
SELECT 
    id, 
    email, 
    first_name, 
    last_name, 
    role, 
    user_type,
    is_active,
    is_verified
FROM users 
WHERE role = 'ROLE_VENDOR' 
ORDER BY created_at DESC;

-- 5. Create vendor profile entry if needed
INSERT IGNORE INTO vendor_profiles (
    user_id,
    vendor_name,
    business_type,
    established_year,
    is_verified,
    created_at,
    updated_at
) 
SELECT 
    id,
    CONCAT(first_name, ' ', last_name, ' Enterprise'),
    'MANUFACTURER',
    YEAR(CURDATE()),
    1,
    NOW(),
    NOW()
FROM users 
WHERE role = 'ROLE_VENDOR' 
AND id NOT IN (SELECT user_id FROM vendor_profiles WHERE user_id IS NOT NULL);

-- 6. Final verification query
SELECT 
    u.id, 
    u.email, 
    u.first_name, 
    u.last_name, 
    u.role, 
    u.user_type,
    vp.vendor_name,
    vp.business_type
FROM users u
LEFT JOIN vendor_profiles vp ON u.id = vp.user_id
WHERE u.role = 'ROLE_VENDOR'
ORDER BY u.created_at DESC;
