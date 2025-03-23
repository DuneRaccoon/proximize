import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-white px-6 py-16 md:py-24">
          <div className="container mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col justify-center">
                <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                  Create and manage digital wallet passes with ease
                </h1>
                <p className="mb-6 text-lg text-gray-600 md:text-xl">
                  A self-service SaaS platform for businesses to create and manage Apple/Google Wallet passes for their
                  customers.
                </p>
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link href="/register">
                    <Button size="lg" className="font-semibold">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="font-semibold">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-full max-w-[400px] rounded-xl bg-gradient-to-r from-primary to-primary/60 p-1 shadow-xl">
                  <div className="h-full w-full rounded-lg bg-white p-4">
                    <div className="rounded bg-primary/10 p-4">
                      <div className="mb-2 h-6 w-32 rounded bg-primary/20"></div>
                      <div className="mb-2 h-4 w-3/4 rounded bg-primary/20"></div>
                      <div className="mb-4 h-4 w-1/2 rounded bg-primary/20"></div>
                      <div className="flex space-x-2">
                        <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                        <div className="flex-1">
                          <div className="mb-1 h-4 w-24 rounded bg-primary/20"></div>
                          <div className="h-3 w-32 rounded bg-primary/20"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded bg-primary/10 p-2">
                        <div className="mb-1 h-3 w-12 rounded bg-primary/20"></div>
                        <div className="h-4 w-16 rounded bg-primary/20"></div>
                      </div>
                      <div className="rounded bg-primary/10 p-2">
                        <div className="mb-1 h-3 w-12 rounded bg-primary/20"></div>
                        <div className="h-4 w-16 rounded bg-primary/20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Key Features</h2>
              <p className="mx-auto max-w-3xl text-lg text-gray-600">
                Everything you need to create, manage and distribute digital wallet passes to your customers.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Customer Management</h3>
                <p className="text-gray-600">Import and manage your contacts with easy-to-use tools.</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                    <polyline points="3 7 12 13 21 7"></polyline>
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Pass Template Designer</h3>
                <p className="text-gray-600">Create visually appealing wallet passes with our easy template designer.</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Multi-platform Support</h3>
                <p className="text-gray-600">Support for both Apple Wallet and Google Wallet pass formats.</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 11a9 9 0 0 1 9 9"></path>
                    <path d="M4 4a16 16 0 0 1 16 16"></path>
                    <circle cx="5" cy="19" r="2"></circle>
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Campaign Management</h3>
                <p className="text-gray-600">Send passes in bulk to customers with targeted campaigns.</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Geo-targeting</h3>
                <p className="text-gray-600">Create location-based campaigns that trigger when customers are nearby.</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v4"></path>
                    <path d="M12 18v4"></path>
                    <path d="m4.93 4.93 2.83 2.83"></path>
                    <path d="m16.24 16.24 2.83 2.83"></path>
                    <path d="M2 12h4"></path>
                    <path d="M18 12h4"></path>
                    <path d="m4.93 19.07 2.83-2.83"></path>
                    <path d="m16.24 7.76 2.83-2.83"></path>
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Real-time Updates</h3>
                <p className="text-gray-600">Keep passes up to date with real-time information and updates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/10 py-16">
          <div className="container mx-auto max-w-6xl px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to get started?</h2>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600">
              Create your account today and start sending digital wallet passes to your customers in minutes.
            </p>
            <Link href="/register">
              <Button size="lg" className="px-8 font-semibold">
                Sign Up for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
