'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WalletPassTemplate } from '@/lib/types';

interface TemplatePreviewProps {
  template: WalletPassTemplate;
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  // Get the background, foreground, and label colors from the template or use defaults
  const backgroundColor = template.background_color || '#ffffff';
  const foregroundColor = template.foreground_color || '#000000';
  const labelColor = template.label_color || '#888888';

  return (
    <Card className="overflow-hidden shadow-lg">
      <div 
        className="flex h-full flex-col p-6 pb-8 rounded-md"
        style={{ 
          backgroundColor,
          color: foregroundColor,
        }}
      >
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold">{template.name}</h3>
          {template.description && (
            <p style={{ color: labelColor }}>{template.description}</p>
          )}
        </div>

        {/* Header Fields */}
        {template.header_fields && template.header_fields.length > 0 && (
          <div className="mb-4">
            {template.header_fields.map((field, index) => (
              <div key={index} className="mb-2">
                <div style={{ color: labelColor }} className="text-xs uppercase">
                  {field.label}
                </div>
                <div className="text-sm">{field.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Primary Fields */}
        {template.primary_fields && template.primary_fields.length > 0 && (
          <div className="mb-4 text-center">
            {template.primary_fields.map((field, index) => (
              <div key={index} className="mb-2">
                <div style={{ color: labelColor }} className="text-xs uppercase">
                  {field.label}
                </div>
                <div className="text-2xl font-bold">{field.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Secondary Fields */}
        {template.secondary_fields && template.secondary_fields.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-4">
            {template.secondary_fields.map((field, index) => (
              <div key={index}>
                <div style={{ color: labelColor }} className="text-xs uppercase">
                  {field.label}
                </div>
                <div className="text-sm">{field.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Auxiliary Fields */}
        {template.auxiliary_fields && template.auxiliary_fields.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-4">
            {template.auxiliary_fields.map((field, index) => (
              <div key={index}>
                <div style={{ color: labelColor }} className="text-xs uppercase">
                  {field.label}
                </div>
                <div className="text-sm">{field.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* If there are no fields, show a placeholder */}
        {(!template.header_fields?.length && !template.primary_fields?.length && 
          !template.secondary_fields?.length && !template.auxiliary_fields?.length) && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center opacity-70">This template has no fields defined.</p>
          </div>
        )}

        {/* Pass Type Indicator */}
        <div className="mt-auto pt-4 text-center">
          <span 
            className="text-xs uppercase tracking-wider"
            style={{ color: labelColor }}
          >
            {template.pass_type} Pass
          </span>
        </div>
      </div>
    </Card>
  );
}
