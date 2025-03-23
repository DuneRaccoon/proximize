'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletPassTemplate } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Edit, Copy, Trash, CreditCard, Eye } from 'lucide-react';

interface TemplateCardProps {
  template: WalletPassTemplate;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function TemplateCard({ template, onDelete, onDuplicate }: TemplateCardProps) {
  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Function to determine template card background color
  const getTemplateColor = () => {
    if (!template.background_color) return '#f8fafc';
    return template.background_color;
  };

  // Function to determine text color based on background brightness
  const getTextColor = () => {
    const color = template.background_color || '#f8fafc';
    // Simple brightness calculation (not perfect but works for basic colors)
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#000000' : '#ffffff';
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div 
        className="h-36 p-4"
        style={{ 
          backgroundColor: getTemplateColor(),
          color: getTextColor()
        }}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="mb-1 text-xs opacity-80">
              {formatType(template.pass_type)} Pass
            </div>
            <h3 className="font-semibold">{template.name}</h3>
          </div>
          
          <div className="flex items-center space-x-1">
            {template.is_active ? (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">Active</span>
            ) : (
              <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">Inactive</span>
            )}
            
            {template.is_archived && (
              <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">Archived</span>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-4 flex justify-between text-xs text-gray-500">
          <div>Created {formatDate(template.created_at, 'MMM d, yyyy')}</div>
        </div>
      
        <div className="flex justify-end space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
          >
            <Link href={`/templates/${template.id}`}>
              <Eye className="mr-1 h-4 w-4" />
              View
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDuplicate(template.id)}
          >
            <Copy className="mr-1 h-4 w-4" />
            Duplicate
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            asChild
          >
            <Link href={`/templates/${template.id}/edit`}>
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(template.id)}
          >
            <Trash className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
