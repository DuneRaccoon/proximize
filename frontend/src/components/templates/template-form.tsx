'use client';

import React, { useState } from 'react';
import { WalletPassTemplateCreate, WalletPassTemplateUpdate, WalletPassField } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Plus, Trash, Move } from 'lucide-react';
import { generateId } from '@/lib/utils';

interface TemplateFormProps {
  initialData?: WalletPassTemplateUpdate;
  onSubmit: (data: WalletPassTemplateCreate | WalletPassTemplateUpdate) => Promise<void>;
  isLoading: boolean;
}

export function TemplateForm({ initialData, onSubmit, isLoading }: TemplateFormProps) {
  const [formData, setFormData] = useState<WalletPassTemplateCreate | WalletPassTemplateUpdate>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    pass_type: initialData?.pass_type || 'generic',
    background_color: initialData?.background_color || '#ffffff',
    foreground_color: initialData?.foreground_color || '#000000',
    label_color: initialData?.label_color || '#888888',
    header_fields: initialData?.header_fields || [],
    primary_fields: initialData?.primary_fields || [],
    secondary_fields: initialData?.secondary_fields || [],
    auxiliary_fields: initialData?.auxiliary_fields || [],
    back_fields: initialData?.back_fields || [],
    organization_id: initialData?.organization_id || '',
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
  });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<string>('general');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value,
    }));
  };

  const handleFieldChange = (
    section: 'header_fields' | 'primary_fields' | 'secondary_fields' | 'auxiliary_fields' | 'back_fields',
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const updatedFields = [...(prev[section] || [])];
      updatedFields[index] = {
        ...updatedFields[index],
        [field]: value,
      };
      return {
        ...prev,
        [section]: updatedFields,
      };
    });
  };

  const addField = (section: 'header_fields' | 'primary_fields' | 'secondary_fields' | 'auxiliary_fields' | 'back_fields') => {
    const newField: WalletPassField = {
      key: `field_${generateId(8)}`,
      label: '',
      value: '',
      type: 'text',
      text_alignment: 'left',
    };
    
    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newField],
    }));
  };

  const removeField = (
    section: 'header_fields' | 'primary_fields' | 'secondary_fields' | 'auxiliary_fields' | 'back_fields',
    index: number
  ) => {
    setFormData((prev) => {
      const updatedFields = [...(prev[section] || [])];
      updatedFields.splice(index, 1);
      return {
        ...prev,
        [section]: updatedFields,
      };
    });
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <div className="mb-4 flex items-center rounded-md bg-destructive/15 p-3 text-destructive">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex space-x-2 border-b">
          <button
            type="button"
            className={`border-b-2 px-4 py-2 ${
              activeTab === 'general' ? 'border-primary' : 'border-transparent'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            type="button"
            className={`border-b-2 px-4 py-2 ${
              activeTab === 'appearance' ? 'border-primary' : 'border-transparent'
            }`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
          <button
            type="button"
            className={`border-b-2 px-4 py-2 ${
              activeTab === 'fields' ? 'border-primary' : 'border-transparent'
            }`}
            onClick={() => setActiveTab('fields')}
          >
            Fields
          </button>
        </div>

        {activeTab === 'general' && (
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="e.g., Loyalty Card"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder="Brief description of this template"
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pass_type">Pass Type*</Label>
                <select
                  id="pass_type"
                  name="pass_type"
                  value={formData.pass_type || 'generic'}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="generic">Generic</option>
                  <option value="coupon">Coupon</option>
                  <option value="eventTicket">Event Ticket</option>
                  <option value="boardingPass">Boarding Pass</option>
                  <option value="storeCard">Store Card</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'appearance' && (
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="background_color">Background Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="background_color"
                      name="background_color"
                      type="color"
                      value={formData.background_color || '#ffffff'}
                      onChange={handleChange}
                      className="w-12 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.background_color || '#ffffff'}
                      onChange={handleChange}
                      name="background_color"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foreground_color">Foreground Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="foreground_color"
                      name="foreground_color"
                      type="color"
                      value={formData.foreground_color || '#000000'}
                      onChange={handleChange}
                      className="w-12 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.foreground_color || '#000000'}
                      onChange={handleChange}
                      name="foreground_color"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="label_color">Label Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="label_color"
                      name="label_color"
                      type="color"
                      value={formData.label_color || '#888888'}
                      onChange={handleChange}
                      className="w-12 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.label_color || '#888888'}
                      onChange={handleChange}
                      name="label_color"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Template Preview</Label>
                <div 
                  className="rounded-md border p-4 min-h-[200px] w-full"
                  style={{ 
                    backgroundColor: formData.background_color || '#ffffff',
                    color: formData.foreground_color || '#000000'
                  }}
                >
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">{formData.name || 'Template Name'}</h3>
                      <p style={{ color: formData.label_color || '#888888' }}>{formData.description || 'Template Description'}</p>
                    </div>

                    {/* Sample fields for preview */}
                    <div className="space-y-2">
                      <div className="text-sm" style={{ color: formData.label_color || '#888888' }}>SAMPLE FIELD LABEL</div>
                      <div className="text-xl">Sample Field Value</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'fields' && (
          <div className="space-y-6">
            {/* Header Fields */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Header Fields</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addField('header_fields')}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Field
                </Button>
              </CardHeader>
              <CardContent>
                {(!formData.header_fields || formData.header_fields.length === 0) ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No header fields. Click "Add Field" to create one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.header_fields.map((field, index) => (
                      <div key={index} className="rounded-md border p-4 relative">
                        <div className="absolute right-2 top-2 flex space-x-1">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeField('header_fields', index)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Key*</Label>
                            <Input 
                              value={field.key} 
                              onChange={(e) => handleFieldChange('header_fields', index, 'key', e.target.value)}
                              placeholder="Unique identifier (e.g., member_number)"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Label*</Label>
                            <Input 
                              value={field.label} 
                              onChange={(e) => handleFieldChange('header_fields', index, 'label', e.target.value)}
                              placeholder="Display label (e.g., Member Number)"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Value*</Label>
                            <Input 
                              value={field.value} 
                              onChange={(e) => handleFieldChange('header_fields', index, 'value', e.target.value)}
                              placeholder="Default value or variable (e.g., $member_id)"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Field Type</Label>
                            <select
                              value={field.type || 'text'}
                              onChange={(e) => handleFieldChange('header_fields', index, 'type', e.target.value)}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="date">Date</option>
                              <option value="currency">Currency</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Primary Fields */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Primary Fields</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addField('primary_fields')}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Field
                </Button>
              </CardHeader>
              <CardContent>
                {(!formData.primary_fields || formData.primary_fields.length === 0) ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No primary fields. Click "Add Field" to create one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.primary_fields.map((field, index) => (
                      <div key={index} className="rounded-md border p-4 relative">
                        <div className="absolute right-2 top-2 flex space-x-1">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeField('primary_fields', index)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Key*</Label>
                            <Input 
                              value={field.key} 
                              onChange={(e) => handleFieldChange('primary_fields', index, 'key', e.target.value)}
                              placeholder="Unique identifier"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Label*</Label>
                            <Input 
                              value={field.label} 
                              onChange={(e) => handleFieldChange('primary_fields', index, 'label', e.target.value)}
                              placeholder="Display label"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Value*</Label>
                            <Input 
                              value={field.value} 
                              onChange={(e) => handleFieldChange('primary_fields', index, 'value', e.target.value)}
                              placeholder="Default value or variable"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Field Type</Label>
                            <select
                              value={field.type || 'text'}
                              onChange={(e) => handleFieldChange('primary_fields', index, 'type', e.target.value)}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="date">Date</option>
                              <option value="currency">Currency</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Secondary Fields */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Secondary Fields</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addField('secondary_fields')}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Field
                </Button>
              </CardHeader>
              <CardContent>
                {(!formData.secondary_fields || formData.secondary_fields.length === 0) ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No secondary fields. Click "Add Field" to create one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.secondary_fields.map((field, index) => (
                      <div key={index} className="rounded-md border p-4 relative">
                        <div className="absolute right-2 top-2 flex space-x-1">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeField('secondary_fields', index)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Key*</Label>
                            <Input 
                              value={field.key} 
                              onChange={(e) => handleFieldChange('secondary_fields', index, 'key', e.target.value)}
                              placeholder="Unique identifier"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Label*</Label>
                            <Input 
                              value={field.label} 
                              onChange={(e) => handleFieldChange('secondary_fields', index, 'label', e.target.value)}
                              placeholder="Display label"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Value*</Label>
                            <Input 
                              value={field.value} 
                              onChange={(e) => handleFieldChange('secondary_fields', index, 'value', e.target.value)}
                              placeholder="Default value or variable"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Field Type</Label>
                            <select
                              value={field.type || 'text'}
                              onChange={(e) => handleFieldChange('secondary_fields', index, 'type', e.target.value)}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="date">Date</option>
                              <option value="currency">Currency</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              initialData ? 'Update Template' : 'Create Template'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
