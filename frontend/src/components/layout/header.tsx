import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { UserCircle, Menu, LogOut, Settings } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Wallet Pass Manager</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <nav className="mr-4">
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/dashboard" className="text-gray-600 hover:text-primary">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/customers" className="text-gray-600 hover:text-primary">
                      Customers
                    </Link>
                  </li>
                  <li>
                    <Link href="/templates" className="text-gray-600 hover:text-primary">
                      Templates
                    </Link>
                  </li>
                  <li>
                    <Link href="/campaigns" className="text-gray-600 hover:text-primary">
                      Campaigns
                    </Link>
                  </li>
                  <li>
                    <Link href="/locations" className="text-gray-600 hover:text-primary">
                      Locations
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-1 rounded-full p-1 hover:bg-gray-100"
                >
                  <UserCircle className="h-8 w-8 text-gray-500" />
                  <span className="hidden md:inline">{user?.full_name || user?.email}</span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden">
          <button
            className="text-gray-500 hover:text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          {isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 z-50 bg-white shadow-md">
              <div className="container mx-auto px-4 py-2">
                <ul className="space-y-2">
                  {isAuthenticated ? (
                    <>
                      <li>
                        <Link
                          href="/dashboard"
                          className="block py-2 text-gray-600 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/customers"
                          className="block py-2 text-gray-600 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Customers
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/templates"
                          className="block py-2 text-gray-600 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Templates
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/campaigns"
                          className="block py-2 text-gray-600 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Campaigns
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/locations"
                          className="block py-2 text-gray-600 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Locations
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/profile"
                          className="block py-2 text-gray-600 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/settings"
                          className="block py-2 text-gray-600 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          className="block w-full py-2 text-left text-gray-600 hover:text-primary"
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          href="/login"
                          className="block py-2 text-gray-600 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Log in
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/register"
                          className="block py-2 text-gray-600 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign up
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
