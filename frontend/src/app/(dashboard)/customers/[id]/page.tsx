'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { customerService, passService } from '@/lib/api';
import { Customer, WalletPass } from '@/lib/types';
import { formatDate, formatPhoneNumber } from '@/lib/utils';
import { Edit, ArrowLeft, Mail, Send, Phone, Calendar, Tag, Smartphone, CreditCard } from 'lucide-react';

interface CustomerDetailsPageProps {
  params: {
    id: string;
  };
}

export default function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [passes, setPasses] = useState<WalletPass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setIsLoading(true);
        const customerData = await customerService.getCustomerById(params.id);
        setCustomer(customerData);
        
        // Get customer's passes
        const passesData = await passService.getAllPasses({ customer_id: params.id });
        setPasses(passesData);
      } catch (error) {
        console.error('Failed to fetch customer details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-48 flex-col items-center justify-center">
        <p className="text-lg font-medium">Customer not found</p>
        <Link href="/customers">
          <Button variant="link" className="mt-2">
            Back to customers
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
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{customer.full_name || customer.email}</h1>
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              customer.is_active 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}
          >
            {customer.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/customers/${customer.id}/edit`}>
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button>
            <Send className="mr-1 h-4 w-4" />
            Send Pass
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer.email && (
              <div className="flex items-start space-x-3">
                <Mail className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{customer.email}</p>
                </div>
              </div>
            )}

            {customer.phone && (
              <div className="flex items-start space-x-3">
                <Phone className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{formatPhoneNumber(customer.phone)}</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <Calendar className="mt-0.5 h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p>{formatDate(customer.created_at, 'PPP')}</p>
              </div>
            </div>

            {customer.last_engagement && (
              <div className="flex items-start space-x-3">
                <Calendar className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Engagement</p>
                  <p>{formatDate(customer.last_engagement, 'PPP')}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags & Communication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Tag className="mt-0.5 h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Tags</p>
                {customer.tags && customer.tags.length > 0 ? (
                  <div className="mt-1 flex flex-wrap gap-1">
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
                  <p>No tags</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Smartphone className="mt-0.5 h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Communication Preferences</p>
                <ul className="mt-1 space-y-1">
                  <li className="flex items-center">
                    <span className={customer.email_opt_in ? 'text-green-600' : 'text-red-600'}>
                      {customer.email_opt_in ? '✓' : '✗'}
                    </span>
                    <span className="ml-2">Email</span>
                  </li>
                  <li className="flex items-center">
                    <span className={customer.sms_opt_in ? 'text-green-600' : 'text-red-600'}>
                      {customer.sms_opt_in ? '✓' : '✗'}
                    </span>
                    <span className="ml-2">SMS</span>
                  </li>
                  <li className="flex items-center">
                    <span className={customer.push_opt_in ? 'text-green-600' : 'text-red-600'}>
                      {customer.push_opt_in ? '✓' : '✗'}
                    </span>
                    <span className="ml-2">Push Notifications</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wallet Passes</CardTitle>
          </CardHeader>
          <CardContent>
            {passes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CreditCard className="mb-2 h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-500">No passes found for this customer</p>
                <Button size="sm" className="mt-4">
                  <Send className="mr-1 h-4 w-4" />
                  Create Pass
                </Button>
              </div>
            ) : (
              <ul className="divide-y">
                {passes.map((pass) => (
                  <li key={pass.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          <Link href={`/passes/${pass.id}`} className="hover:underline">
                            Pass #{pass.serial_number.substring(0, 8)}
                          </Link>
                        </p>
                        <p className="text-sm text-gray-500">
                          Created {formatDate(pass.created_at, 'PP')}
                        </p>
                      </div>
                      <div className="flex">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            pass.is_redeemed
                              ? 'bg-green-100 text-green-700'
                              : pass.is_voided
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {pass.is_redeemed
                            ? 'Redeemed'
                            : pass.is_voided
                            ? 'Voided'
                            : 'Active'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {customer.custom_fields && Object.keys(customer.custom_fields).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(customer.custom_fields).map(([key, value]) => (
                <div key={key} className="rounded-md border p-3">
                  <p className="text-sm font-medium text-gray-500">{key}</p>
                  <p className="mt-1">{String(value)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
