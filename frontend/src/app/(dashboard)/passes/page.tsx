'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PassCard } from '@/components/passes/pass-card';
import { passService, templateService, customerService } from '@/lib/api';
import { WalletPass, WalletPassTemplate, Customer } from '@/lib/types';
import { Plus, Search, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function PassesPage() {
  const [passes, setPasses] = useState<WalletPass[]>([]);
  const [templates, setTemplates] = useState<{ [key: string]: WalletPassTemplate }>({});
  const [customers, setCustomers] = useState<{ [key: string]: Customer }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showVoidDialog, setShowVoidDialog] = useState(false);
  const [passToVoid, setPassToVoid] = useState<string | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [passToUpdate, setPassToUpdate] = useState<string | null>(null);
  const [filterTemplate, setFilterTemplate] = useState<string>('');
  
  const fetchPasses = async () => {
    try {
      setIsLoading(true);
      // Get passes
      const params: any = {};
      if (filterTemplate) {
        params.template_id = filterTemplate;
      }
      
      const passesData = await passService.getAllPasses(params);
      setPasses(passesData);
      
      // Get templates
      const templatesData = await templateService.getAllTemplates();
      const templatesMap: { [key: string]: WalletPassTemplate } = {};
      templatesData.forEach(template => {
        templatesMap[template.id] = template;
      });
      setTemplates(templatesMap);
      
      // Get customers
      const customersData = await customerService.getAllCustomers();
      const customersMap: { [key: string]: Customer } = {};
      customersData.forEach(customer => {
        customersMap[customer.id] = customer;
      });
      setCustomers(customersMap);
    } catch (error) {
      console.error('Failed to fetch passes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, [filterTemplate]);

  const handleVoidPass = async () => {
    if (!passToVoid) return;

    try {
      const updatedPass = await passService.updatePass(passToVoid, { is_voided: true });
      setPasses(passes.map(p => p.id === passToVoid ? updatedPass : p));
      setShowVoidDialog(false);
    } catch (error) {
      console.error('Failed to void pass:', error);
    }
  };

  const handleUpdatePass = async () => {
    if (!passToUpdate) return;
    
    try {
      // This would typically update dynamic content in a wallet pass
      // For now, let's just update the last_updated_tag
      const updatedPass = await passService.updatePass(passToUpdate, { 
        last_updated_tag: new Date().toISOString() 
      });
      setPasses(passes.map(p => p.id === passToUpdate ? updatedPass : p));
      setShowUpdateDialog(false);
    } catch (error) {
      console.error('Failed to update pass:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPasses();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Wallet Passes</h1>

        <div className="flex flex-col gap-4 sm:flex-row">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search" 
                placeholder="Search passes..." 
                className="w-full pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" variant="ghost" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </form>

          <Link href="/passes/new">
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Create Pass
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setFilterTemplate('')}
          className={!filterTemplate ? 'bg-primary/10' : ''}
        >
          All Passes
        </Button>
        {Object.values(templates).map(template => (
          <Button 
            key={template.id}
            variant="outline" 
            size="sm" 
            onClick={() => setFilterTemplate(template.id)}
            className={filterTemplate === template.id ? 'bg-primary/10' : ''}
          >
            {template.name}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : passes.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">No passes found</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Get started by creating your first wallet pass.
          </p>
          <Link href="/passes/new">
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Create Pass
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {passes.map((pass) => (
            <PassCard 
              key={pass.id} 
              pass={pass}
              template={templates[pass.template_id]}
              customer={customers[pass.customer_id]}
              onVoid={(id) => {
                setPassToVoid(id);
                setShowVoidDialog(true);
              }}
              onUpdate={(id) => {
                setPassToUpdate(id);
                setShowUpdateDialog(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Void Pass Confirmation Dialog */}
      <Dialog open={showVoidDialog} onOpenChange={setShowVoidDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Void Pass</DialogTitle>
            <DialogDescription>
              Are you sure you want to void this pass? The pass will be marked as invalid and can no longer be used.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVoidDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleVoidPass}>Void Pass</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Pass Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Pass</DialogTitle>
            <DialogDescription>
              This will push updates to the pass on the customer's device. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdatePass}>Update Pass</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
