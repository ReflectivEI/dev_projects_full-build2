import { Link } from 'wouter';

export default function Footer() {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { href: '/', label: 'Overview' },
        { href: '/methodology', label: 'Signal Intelligence™' },
        { href: '/demo', label: 'Platform Demo' },
        { href: '/pricing', label: 'Pricing' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { href: '/resources', label: 'Blog & Insights' },
        { href: '/case-studies', label: 'Case Studies' },
        { href: '/documentation', label: 'Documentation' },
        { href: '/support', label: 'Support' },
      ],
    },
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About Us' },
        { href: '/team', label: 'Team' },
        { href: '/careers', label: 'Careers' },
        { href: '/contact', label: 'Contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/security', label: 'Security' },
        { href: '/compliance', label: 'Compliance' },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-xl font-bold tracking-tight mb-4 block">
              ReflectivAi
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered sales enablement built on behavioral science. Practice, analyze, improve.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ReflectivAi. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built on Signal Intelligence™ — A behavioral science framework for high-stakes
              communication.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
