'use client';

import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Edit, Trash, CreditCard, Mail } from 'lucide-react';
import Link from 'next/link';

interface CustomerTableProps {
  customers: Customer[];
  onDelete: (id: string) => void;
  onSendPass: (customerId: string) => void;
}

export function CustomerTable({ customers, onDelete, onSendPass }: CustomerTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No customers found.
            </TableCell>
          </TableRow>
        ) : (
          customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">
                <Link href={`/customers/${customer.id}`} className="hover:underline">
                  {customer.full_name || 'N/A'}
                </Link>
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone || 'N/A'}</TableCell>
              <TableCell>{formatDate(customer.created_at, 'PPP')}</TableCell>
              <TableCell>
                {customer.tags && customer.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {customer.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  'None'
                )}
              </TableCell>
              <TableCell>
                <span 
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    customer.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {customer.is_active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onSendPass(customer.id)}>
                    <CreditCard className="h-4 w-4" />
                    <span className="sr-only">Send Pass</span>
                  </Button>
                  <Link href={`/customers/${customer.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(customer.id)}>
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
