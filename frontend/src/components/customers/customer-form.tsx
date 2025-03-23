'use client';

import React, { useState } from 'react';
import { CustomerCreate, CustomerUpdate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface CustomerFormProps {
  initialData?: CustomerUpdate;
  onSubmit: (data: CustomerCreate | CustomerUpdate) => Promise<void>;
  isLoading: boolean;
}

export function CustomerForm({ initialData, onSubmit, isLoading }: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerCreate | CustomerUpdate>({
    email: initialData?.email || '',
    full_name: initialData?.full_name || '',
    phone: initialData?.phone || '',
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email_opt_in: initialData?.email_opt_in !== undefined ? initialData.email_opt_in : true,
    sms_opt_in: initialData?.sms_opt_in !== undefined ? initialData.sms_opt_in : true,
    push_opt_in: initialData?.push_opt_in !== undefined ? initialData.push_opt_in : true,
    tags: initialData?.tags || [],
    custom_fields: initialData?.custom_fields || {},
    organization_id: initialData?.organization_id || '',
  });
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Customer' : 'Add New Customer'}</CardTitle>
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
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="customer@example.com"
                value={formData.email || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="John Doe"
                value={formData.full_name || ''}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="John"
                value={formData.first_name || ''}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Doe"
                value={formData.last_name || ''}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 rounded-full p-1 hover:bg-primary/20"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Communication Preferences</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  id="email_opt_in"
                  name="email_opt_in"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={formData.email_opt_in}
                  onChange={handleChange}
                />
                <label htmlFor="email_opt_in" className="text-sm">
                  Email communications
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="sms_opt_in"
                  name="sms_opt_in"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={formData.sms_opt_in}
                  onChange={handleChange}
                />
                <label htmlFor="sms_opt_in" className="text-sm">
                  SMS notifications
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="push_opt_in"
                  name="push_opt_in"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={formData.push_opt_in}
                  onChange={handleChange}
                />
                <label htmlFor="push_opt_in" className="text-sm">
                  Push notifications
                </label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
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
              initialData ? 'Update Customer' : 'Create Customer'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
