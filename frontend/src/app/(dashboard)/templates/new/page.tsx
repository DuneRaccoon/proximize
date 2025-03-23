'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TemplateForm } from '@/components/templates/template-form';
import { templateService } from '@/lib/api';
import { WalletPassTemplateCreate } from '@/lib/types';
import { useAuth } from '@/providers/auth-provider';

export default function NewTemplatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleCreateTemplate = async (data: WalletPassTemplateCreate) => {
    setIsLoading(true);
    try {
      // Set the organization ID from the current user
      if (user?.organization_id) {
        data.organization_id = user.organization_id;
      }
      
      await templateService.createTemplate(data);
      router.push('/templates');
    } catch (error) {
      console.error('Failed to create template:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/templates">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Template</h1>
      </div>

      <TemplateForm 
        onSubmit={handleCreateTemplate} 
        isLoading={isLoading} 
      />
    </div>
  );
}
