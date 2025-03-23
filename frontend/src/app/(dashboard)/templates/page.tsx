'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { templateService } from '@/lib/api';
import { WalletPassTemplate } from '@/lib/types';
import { Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { TemplateCard } from '@/components/templates/template-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<WalletPassTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  
  const { user } = useAuth();

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await templateService.getAllTemplates();
      
      // Filter out archived templates unless explicitly searching for them
      const filteredTemplates = data.filter(template => !template.is_archived);
      
      setTemplates(filteredTemplates);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
      await templateService.deleteTemplate(templateToDelete);
      setTemplates(templates.filter(t => t.id !== templateToDelete));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const handleDuplicateTemplate = async (id: string) => {
    try {
      const templateToDuplicate = templates.find(t => t.id === id);
      if (!templateToDuplicate) return;

      const newTemplateData = {
        ...templateToDuplicate,
        name: `${templateToDuplicate.name} (Copy)`,
        organization_id: user?.organization_id || '',
      };

      // Remove id and timestamps
      delete (newTemplateData as any).id;
      delete (newTemplateData as any).created_at;
      delete (newTemplateData as any).updated_at;
      delete (newTemplateData as any).created_by_id;

      const newTemplate = await templateService.createTemplate(newTemplateData);
      setTemplates([...templates, newTemplate]);
    } catch (error) {
      console.error('Failed to duplicate template:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTemplates();
  };

  const filterTemplatesByType = (type: string | null) => {
    if (!type) {
      fetchTemplates();
    } else {
      const filtered = templates.filter(template => template.pass_type === type);
      setTemplates(filtered);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Pass Templates</h1>

        <div className="flex flex-col gap-4 sm:flex-row">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search" 
                placeholder="Search templates..." 
                className="w-full pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" variant="ghost" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </form>

          <Link href="/templates/new">
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              New Template
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchTemplates()}
          className={!searchTerm ? 'bg-primary/10' : ''}
        >
          All
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => filterTemplatesByType('generic')}
        >
          Generic
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => filterTemplatesByType('coupon')}
        >
          Coupon
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => filterTemplatesByType('eventTicket')}
        >
          Event Ticket
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => filterTemplatesByType('boardingPass')}
        >
          Boarding Pass
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => filterTemplatesByType('storeCard')}
        >
          Store Card
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : templates.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">No templates found</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Get started by creating your first pass template.
          </p>
          <Link href="/templates/new">
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Create Template
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard 
              key={template.id} 
              template={template}
              onDelete={(id) => {
                setTemplateToDelete(id);
                setShowDeleteDialog(true);
              }}
              onDuplicate={handleDuplicateTemplate}
            />
          ))}
        </div>
      )}

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
