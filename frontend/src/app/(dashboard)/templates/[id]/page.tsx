'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { templateService, passService } from '@/lib/api';
import { WalletPassTemplate } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Edit, ArrowLeft, Copy, Trash, Send, Clock, User, CreditCard } from 'lucide-react';
import { TemplatePreview } from '@/components/templates/template-preview';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface TemplateDetailsPageProps {
  params: {
    id: string;
  };
}

export default function TemplateDetailsPage({ params }: TemplateDetailsPageProps) {
  const [template, setTemplate] = useState<WalletPassTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      try {
        setIsLoading(true);
        const data = await templateService.getTemplateById(params.id);
        setTemplate(data);
      } catch (error) {
        console.error('Failed to fetch template details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateDetails();
  }, [params.id]);

  const handleDeleteTemplate = async () => {
    try {
      await templateService.deleteTemplate(params.id);
      router.push('/templates');
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const handleDuplicateTemplate = async () => {
    try {
      if (!template) return;

      const newTemplateData = {
        ...template,
        name: `${template.name} (Copy)`,
        organization_id: template.organization_id,
      };

      // Remove id and timestamps
      delete (newTemplateData as any).id;
      delete (newTemplateData as any).created_at;
      delete (newTemplateData as any).updated_at;
      delete (newTemplateData as any).created_by_id;

      const newTemplate = await templateService.createTemplate(newTemplateData);
      router.push(`/templates/${newTemplate.id}`);
    } catch (error) {
      console.error('Failed to duplicate template:', error);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/templates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{template.name}</h1>
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              template.is_active 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}
          >
            {template.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDuplicateTemplate}>
            <Copy className="mr-1 h-4 w-4" />
            Duplicate
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/templates/${template.id}/edit`}>
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setShowDeleteDialog(true)}>
            <Trash className="mr-1 h-4 w-4" />
            Delete
          </Button>
          <Button>
            <Send className="mr-1 h-4 w-4" />
            Create Pass
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-8">
        <div className="md:col-span-3">
          <TemplatePreview template={template} />
        </div>
        
        <div className="space-y-6 md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                <p>{template.pass_type.charAt(0).toUpperCase() + template.pass_type.slice(1)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p>{formatDate(template.created_at, 'PPP')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <p>{formatDate(template.updated_at, 'PPP')}</p>
              </div>
              
              {template.description && (
                <div className="md:col-span-2 lg:col-span-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p>{template.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header Fields */}
                {template.header_fields && template.header_fields.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Header Fields</h3>
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {template.header_fields.map((field, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{field.key}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{field.label}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{field.value}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{field.type || 'text'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Primary Fields */}
                {template.primary_fields && template.primary_fields.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Primary Fields</h3>
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {template.primary_fields.map((field, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{field.key}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{field.label}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{field.value}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{field.type || 'text'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Secondary Fields */}
                {template.secondary_fields && template.secondary_fields.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Secondary Fields</h3>
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {template.secondary_fields.map((field, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{field.key}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{field.label}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{field.value}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{field.type || 'text'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Message if no fields */}
                {(!template.header_fields?.length && !template.primary_fields?.length && 
                 !template.secondary_fields?.length && !template.auxiliary_fields?.length && 
                 !template.back_fields?.length) && (
                  <div className="text-center py-4 text-muted-foreground">
                    This template does not have any fields defined.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Template Usage</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Active Passes</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Customers</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Last Used</p>
                  <p className="text-sm">Never</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone and any passes using this template will be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
