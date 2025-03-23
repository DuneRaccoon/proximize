'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomerTable } from '@/components/customers/customer-table';
import { customerService, passService } from '@/lib/api';
import { Customer } from '@/lib/types';
import { Plus, Search, Upload, Filter } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [showSendPassDialog, setShowSendPassDialog] = useState(false);
  const [customerForPass, setCustomerForPass] = useState<string | null>(null);
  
  const { user } = useAuth();

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await customerService.getAllCustomers({
        search: searchTerm,
      });
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;

    try {
      await customerService.deleteCustomer(customerToDelete);
      setCustomers(customers.filter(c => c.id !== customerToDelete));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleSendPass = (customerId: string) => {
    setCustomerForPass(customerId);
    setShowSendPassDialog(true);
  };

  const confirmSendPass = async () => {
    if (!customerForPass) return;

    try {
      // This would trigger a new pass creation flow in a real app
      alert('Pass creation flow would start here for customer: ' + customerForPass);
      setShowSendPassDialog(false);
    } catch (error) {
      console.error('Failed to send pass:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Customers</h1>

        <div className="flex flex-col gap-4 sm:flex-row">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search" 
                placeholder="Search customers..." 
                className="w-full pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" variant="ghost" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Customers</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file to import customers in bulk.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="rounded-md border border-dashed border-gray-300 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mb-2 text-sm text-gray-600">
                      Drag and drop your CSV file here, or click to select a file
                    </p>
                    <Input type="file" className="hidden" id="csv-upload" accept=".csv" />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById('csv-upload')?.click()}>
                      Select CSV File
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                  <Button>Import Customers</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Link href="/customers/new">
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                Add Customer
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <CustomerTable 
            customers={customers} 
            onDelete={(id) => {
              setCustomerToDelete(id);
              setShowDeleteDialog(true);
            }}
            onSendPass={handleSendPass}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Pass Dialog */}
      <Dialog open={showSendPassDialog} onOpenChange={setShowSendPassDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Pass to Customer</DialogTitle>
            <DialogDescription>
              Choose a pass template to send to this customer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>This would show a list of available pass templates in a real implementation.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendPassDialog(false)}>Cancel</Button>
            <Button onClick={confirmSendPass}>Send Pass</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
