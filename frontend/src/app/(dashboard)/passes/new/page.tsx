'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PassForm } from '@/components/passes/pass-form';
import { passService } from '@/lib/api';
import { WalletPassCreate } from '@/lib/types';
import { useAuth } from '@/providers/auth-provider';

export default function NewPassPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customer_id') || undefined;
  const templateId = searchParams.get('template_id') || undefined;
  
  const { user } = useAuth();

  const handleCreatePass = async (data: WalletPassCreate) => {
    setIsLoading(true);
    try {      
      const pass = await passService.createPass(data);
      router.push(`/passes/${pass.id}`);
    } catch (error) {
      console.error('Failed to create pass:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/passes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Pass</h1>
      </div>

      <PassForm 
        onSubmit={handleCreatePass} 
        isLoading={isLoading}
        customerId={customerId}
        templateId={templateId}
      />
    </div>
  );
}
