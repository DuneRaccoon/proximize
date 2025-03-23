'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TemplateForm } from '@/components/templates/template-form';
import { templateService } from '@/lib/api';
import { WalletPassTemplate, WalletPassTemplateUpdate } from '@/lib/types';

interface EditTemplatePageProps {
  params: {
    id: string;
  };
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  const [template, setTemplate] = useState<WalletPassTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        const data = await templateService.getTemplateById(params.id);
        setTemplate(data);
      } catch (error) {
        console.error('Failed to fetch template:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [params.id]);

  const handleUpdateTemplate = async (data: WalletPassTemplateUpdate) => {
    setIsSaving(true);
    try {
      await templateService.updateTemplate(params.id, data);
      router.push(`/templates/${params.id}`);
    } catch (error) {
      console.error('Failed to update template:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <p className="text-lg font-medium">Template not found</p>
        <Link href="/templates">
          <Button variant="link" className="mt-2">
            Back to templates
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/templates/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Template</h1>
      </div>

      <TemplateForm 
        initialData={template} 
        onSubmit={handleUpdateTemplate} 
        isLoading={isSaving} 
      />
    </div>
  );
}
