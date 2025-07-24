import CreateAdminForm from '@/components/admin/CreateAdminForm';

export default function AdminSetupPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Setup</h1>
          <p className="text-gray-600">Create your first admin user to access the admin dashboard</p>
        </div>
        
        <CreateAdminForm />
      </div>
    </div>
  );
}
