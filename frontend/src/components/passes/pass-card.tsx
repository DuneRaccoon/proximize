'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletPass, WalletPassTemplate, Customer } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Download, QrCode, Eye, Refresh, Trash } from 'lucide-react';

interface PassCardProps {
  pass: WalletPass;
  template?: WalletPassTemplate;
  customer?: Customer;
  onVoid: (id: string) => void;
  onUpdate: (id: string) => void;
}

export function PassCard({ pass, template, customer, onVoid, onUpdate }: PassCardProps) {
  // Function to determine template card background color
  const getPassColor = () => {
    if (!template?.background_color) return '#f8fafc';
    return template.background_color;
  };

  // Function to determine text color based on background brightness
  const getTextColor = () => {
    const color = template?.background_color || '#f8fafc';
    // Simple brightness calculation (not perfect but works for basic colors)
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#000000' : '#ffffff';
  };

  // Format pass type for display
  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Get a short version of the serial number for display
  const getShortSerial = () => {
    return pass.serial_number.substring(0, 8);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div 
        className="h-36 p-4"
        style={{ 
          backgroundColor: getPassColor(),
          color: getTextColor()
        }}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="mb-1 text-xs opacity-80">
              Pass #{getShortSerial()}
            </div>
            <h3 className="font-semibold">{template?.name || 'Wallet Pass'}</h3>
            {customer && (
              <p className="mt-1 text-sm opacity-90">{customer.full_name || customer.email}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {pass.is_redeemed ? (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">Redeemed</span>
            ) : pass.is_voided ? (
              <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">Voided</span>
            ) : (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">Active</span>
            )}
            
            {pass.expiration_date && (
              <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">
                Expires {formatDate(pass.expiration_date, 'MM/dd/yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-4 flex justify-between text-xs text-gray-500">
          <div>Created {formatDate(pass.created_at, 'MMM d, yyyy')}</div>
          {pass.is_redeemed && pass.redeemed_at && (
            <div>Redeemed {formatDate(pass.redeemed_at, 'MMM d, yyyy')}</div>
          )}
        </div>
      
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <Link href={`/passes/${pass.id}`}>
              <Eye className="mr-1 h-4 w-4" />
              View
            </Link>
          </Button>
          
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <a 
                href={`/api/v1/passes/${pass.id}/download?pass_type=apple`} 
                target="_blank" 
                rel="noopener noreferrer"
                download
              >
                <Download className="mr-1 h-4 w-4" />
                Download
              </a>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onUpdate(pass.id)}
              disabled={pass.is_voided}
            >
              <Refresh className="mr-1 h-4 w-4" />
              Update
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onVoid(pass.id)}
              disabled={pass.is_voided}
            >
              <Trash className="mr-1 h-4 w-4" />
              Void
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
