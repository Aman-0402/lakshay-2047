import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Labs', href: '/labs' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
  { label: 'Events', href: '/events' },
  { label: 'Partners', href: '/partners' },
]

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'Twitter / X', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <p className="font-heading font-bold text-lg text-white mb-3">
              LAKSHAY 2047
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
              Centre of Future Skills · Parul University · Vadodara, Gujarat.
              14 world-class labs, one campus, infinite possibilities.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-subtle mb-4">
              Explore
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-subtle mb-4">
              Connect
            </p>
            <ul className="space-y-3 mb-6">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted hover:text-white transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="mailto:cfs@paruluniversity.ac.in"
              className="text-sm text-accent hover:underline"
            >
              cfs@paruluniversity.ac.in
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-subtle">
            &copy; {new Date().getFullYear()} Parul University. All rights reserved.
          </p>
          <p className="text-xs text-text-subtle">
            Built with Next.js 15 &amp; React Three Fiber
          </p>
        </div>
      </div>
    </footer>
  )
}
