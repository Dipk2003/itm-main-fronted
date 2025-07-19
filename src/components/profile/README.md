# ProfileSettings Component

A comprehensive React component for managing user profile settings with backend integration, password strength validation, and security features.

## Features

- **Profile Information Management**: Edit name, email, phone, address, and company name
- **Password Management**: Change password with strength validation
- **Security Features**: Password visibility toggle, strength indicator
- **Role-based Access**: Different permissions for admins, vendors, and users
- **Validation**: Form validation with real-time error feedback
- **Backend Integration**: Full API integration with error handling
- **Loading States**: Loading indicators for better UX
- **Responsive Design**: Works on all screen sizes

## Components

### ProfileSettings
The main component that handles all profile-related functionality.

### PasswordStrengthIndicator
A visual indicator showing password strength with requirements checklist.

## Setup

1. **Install Dependencies**
```bash
npm install axios lucide-react
```

2. **Environment Variables**
Add to your `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. **Authentication Context**
Ensure you have an AuthContext providing:
- `user`: Current user object
- `updateProfile`: Function to update user profile
- `isVendor`, `isUser`, `isAdmin`: Role flags

## Usage

### Basic Usage
```jsx
import ProfileSettings from './components/profile/ProfileSettings';

function ProfilePage() {
  return (
    <div>
      <ProfileSettings />
    </div>
  );
}
```

### With Custom Styling
```jsx
<ProfileSettings className="max-w-6xl mx-auto" />
```

## API Endpoints

The component expects the following API endpoints:

### Profile Management
- `PUT /api/profile` - Update profile information
- `GET /api/profile` - Get user profile
- `PUT /api/profile/change-password` - Change password
- `POST /api/profile/upload-picture` - Upload profile picture
- `PUT /api/profile/notifications` - Update notification preferences

### Email Verification
- `POST /api/profile/verify-email` - Verify email address
- `POST /api/profile/resend-verification` - Resend verification email

### Account Management
- `DELETE /api/profile` - Delete account

## Backend Integration

### Request Format

#### Update Profile
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "companyName": "Acme Corp"
}
```

#### Change Password
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123!"
}
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    // ... other user data
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": "Email is already taken",
    "phone": "Invalid phone number format"
  }
}
```

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character

### Access Control
- **Email Editing**: Only allowed for unverified users or admins
- **Phone Editing**: Only allowed for unverified users or admins
- **Role-based Permissions**: Different UI based on user role

### Data Protection
- Password fields with visibility toggle
- Secure token-based authentication
- Automatic token refresh handling

## Styling

The component uses Tailwind CSS classes. Key styling features:
- Responsive grid layout
- Form validation states
- Loading states
- Hover effects
- Focus states

## Error Handling

The component handles various error scenarios:
- Network errors
- Validation errors
- Authentication errors
- Server errors

## Validation

### Client-side Validation
- Real-time form validation
- Email format validation
- Phone number format validation
- Password strength validation

### Server-side Validation
- API response validation
- Error message display
- Field-specific error handling

## Loading States

The component provides loading states for:
- Profile updates
- Password changes
- Form submissions

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Customization

### Styling
Override default styles by passing custom className or modifying Tailwind classes.

### Validation Rules
Modify validation functions in the component to match your requirements.

### API Integration
Update the `profileService` to match your backend API structure.

## File Structure

```
src/
├── components/
│   └── profile/
│       ├── ProfileSettings.tsx
│       ├── PasswordStrengthIndicator.tsx
│       └── README.md
├── services/
│   └── profileService.ts
├── utils/
│   └── apiClient.ts
└── pages/
    └── profile-example.tsx
```

## Dependencies

- React 18+
- Next.js 13+
- Axios for API calls
- Lucide React for icons
- Tailwind CSS for styling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style
2. Add proper TypeScript types
3. Include error handling
4. Test all functionality
5. Update documentation

## License

This component is part of the B2B Marketplace project.
