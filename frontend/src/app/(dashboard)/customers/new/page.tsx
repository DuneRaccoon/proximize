'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerForm } from '@/components/customers/customer-form';
import { customerService } from '@/lib/api';
import { CustomerCreate } from '@/lib/types';
import { useAuth } from '@/providers/auth-provider';

export default function NewCustomerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleCreateCustomer = async (data: CustomerCreate) => {
    setIsLoading(true);
    try {
      // Set the organization ID from the current user
      if (user?.organization_id) {
        data.organization_id = user.organization_id;
      }
      
      await customerService.createCustomer(data);
      router.push('/customers');
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Customer</h1>
      <CustomerForm 
        onSubmit={handleCreateCustomer} 
        isLoading={isLoading} 
      />
    </div>
  );
}
