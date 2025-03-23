import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Wallet Pass Manager</h3>
            <p className="mt-2 text-sm text-gray-600">
              A self-service SaaS platform for businesses to create and manage Apple/Google Wallet passes for their customers.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-500">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/docs" className="text-sm text-gray-600 hover:text-primary">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-sm text-gray-600 hover:text-primary">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-sm text-gray-600 hover:text-primary">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-primary">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-500">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Wallet Pass Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
