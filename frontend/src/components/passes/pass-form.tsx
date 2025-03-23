'use client';

import React, { useState, useEffect } from 'react';
import { WalletPassCreate, WalletPassUpdate, WalletPassTemplate, Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { templateService, customerService } from '@/lib/api';

interface PassFormProps {
  initialData?: WalletPassUpdate;
  customerId?: string;
  templateId?: string;
  onSubmit: (data: WalletPassCreate | WalletPassUpdate) => Promise<void>;
  isLoading: boolean;
}

export function PassForm({ initialData, customerId, templateId, onSubmit, isLoading }: PassFormProps) {
  const [formData, setFormData] = useState<WalletPassCreate | WalletPassUpdate>({
    template_id: initialData?.template_id || templateId || '',
    customer_id: initialData?.customer_id || customerId || '',
    pass_data: initialData?.pass_data || {},
  });
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState<WalletPassTemplate[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WalletPassTemplate | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch templates and customers for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [templatesData, customersData] = await Promise.all([
          templateService.getAllTemplates(),
          customerService.getAllCustomers(),
        ]);
        
        // Filter out archived templates
        const activeTemplates = templatesData.filter(t => t.is_active && !t.is_archived);
        
        setTemplates(activeTemplates);
        setCustomers(customersData);

        // If we have a template ID, fetch its details
        if (formData.template_id) {
          const template = await templateService.getTemplateById(formData.template_id);
          setSelectedTemplate(template);
          
          // Initialize pass_data based on template fields
          const initialPassData = { ...formData.pass_data };
          
          // Initialize with all fields from the template
          const allFields = [
            ...(template.header_fields || []),
            ...(template.primary_fields || []),
            ...(template.secondary_fields || []),
            ...(template.auxiliary_fields || []),
            ...(template.back_fields || []),
          ];
          
          // For each field, if it's not already in pass_data, add it
          allFields.forEach(field => {
            if (!initialPassData[field.key]) {
              initialPassData[field.key] = field.value;
            }
          });
          
          setFormData(prev => ({
            ...prev,
            pass_data: initialPassData,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [formData.template_id, customerId, templateId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTemplateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    
    setFormData((prev) => ({
      ...prev,
      template_id: templateId,
      // Reset pass_data when changing templates
      pass_data: {},
    }));
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      pass_data: {
        ...prev.pass_data,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit(formData);
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Update Pass' : 'Create New Pass'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="mb-4 flex items-center rounded-md bg-destructive/15 p-3 text-destructive">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="template_id">Template*</Label>
              <select
                id="template_id"
                name="template_id"
                value={formData.template_id}
                onChange={handleTemplateChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                disabled={!!initialData}
              >
                <option value="">Select a template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_id">Customer*</Label>
              <select
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                disabled={!!initialData || !!customerId}
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.full_name || customer.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedTemplate && (
            <>
              <div className="mt-6 mb-2">
                <h3 className="text-lg font-medium">Pass Data</h3>
                <p className="text-sm text-muted-foreground">
                  Customize the values for this pass. The fields are defined by the selected template.
                </p>
              </div>

              <div className="space-y-6">
                {/* Header Fields */}
                {selectedTemplate.header_fields && selectedTemplate.header_fields.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-medium">Header Fields</h4>
                    <div className="space-y-4">
                      {selectedTemplate.header_fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`header-${field.key}`}>{field.label}</Label>
                          <Input
                            id={`header-${field.key}`}
                            value={formData.pass_data?.[field.key] || field.value}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.value}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary Fields */}
                {selectedTemplate.primary_fields && selectedTemplate.primary_fields.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-medium">Primary Fields</h4>
                    <div className="space-y-4">
                      {selectedTemplate.primary_fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`primary-${field.key}`}>{field.label}</Label>
                          <Input
                            id={`primary-${field.key}`}
                            value={formData.pass_data?.[field.key] || field.value}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.value}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Secondary Fields */}
                {selectedTemplate.secondary_fields && selectedTemplate.secondary_fields.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-medium">Secondary Fields</h4>
                    <div className="space-y-4">
                      {selectedTemplate.secondary_fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`secondary-${field.key}`}>{field.label}</Label>
                          <Input
                            id={`secondary-${field.key}`}
                            value={formData.pass_data?.[field.key] || field.value}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.value}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auxiliary Fields */}
                {selectedTemplate.auxiliary_fields && selectedTemplate.auxiliary_fields.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-medium">Auxiliary Fields</h4>
                    <div className="space-y-4">
                      {selectedTemplate.auxiliary_fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`auxiliary-${field.key}`}>{field.label}</Label>
                          <Input
                            id={`auxiliary-${field.key}`}
                            value={formData.pass_data?.[field.key] || field.value}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.value}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back Fields */}
                {selectedTemplate.back_fields && selectedTemplate.back_fields.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-medium">Back Fields</h4>
                    <div className="space-y-4">
                      {selectedTemplate.back_fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`back-${field.key}`}>{field.label}</Label>
                          <Input
                            id={`back-${field.key}`}
                            value={formData.pass_data?.[field.key] || field.value}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.value}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                {initialData ? 'Updating...' : 'Create Pass'}
              </>
            ) : (
              initialData ? 'Update Pass' : 'Create Pass'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
