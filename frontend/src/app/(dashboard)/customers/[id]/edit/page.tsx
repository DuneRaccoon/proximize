'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerForm } from '@/components/customers/customer-form';
import { customerService } from '@/lib/api';
import { Customer, CustomerUpdate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditCustomerPageProps {
  params: {
    id: string;
  };
}

export default function EditCustomerPage({ params }: EditCustomerPageProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setIsLoading(true);
        const data = await customerService.getCustomerById(params.id);
        setCustomer(data);
      } catch (error) {
        console.error('Failed to fetch customer:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [params.id]);

  const handleUpdateCustomer = async (data: CustomerUpdate) => {
    setIsSaving(true);
    try {
      await customerService.updateCustomer(params.id, data);
      router.push(`/customers/${params.id}`);
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-48 flex-col items-center justify-center">
        <p className="text-lg font-medium">Customer not found</p>
        <Link href="/customers">
          <Button variant="link" className="mt-2">
            Back to customers
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/customers/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Customer</h1>
      </div>

      <CustomerForm 
        initialData={customer} 
        onSubmit={handleUpdateCustomer} 
        isLoading={isSaving} 
      />
    </div>
  );
}
