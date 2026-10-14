import Link from "next/link";
import {
  ArrowUpRight,
  Leaf,
  Menu,
} from "lucide-react";
import "../eonpulse.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/contents/overview", label: "Overview" },
  { href: "/contents/topography", label: "Topography" },
  { href: "/contents/methodology", label: "Methodology" },
  { href: "/research/nepal", label: "Workspace" },
];

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ep-site">
      <header className="ep-header">
        <div className="ep-header-inner">
          <Link href="/" className="ep-brand">
            <span className="ep-brand-icon">
              <Leaf size={22} />
            </span>
            <span className="ep-brand-name">
              Eon<span>Pulse</span>
              <small>NEPAL</small>
            </span>
          </Link>

          <nav className="ep-nav" aria-label="Main navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.href === "/research/nepal"
                    ? "ep-nav-link ep-nav-cta"
                    : "ep-nav-link"
                }
              >
                {link.label}
                {link.href === "/research/nepal" && (
                  <ArrowUpRight size={16} />
                )}
              </Link>
            ))}
          </nav>

          <Link
            href="/research/nepal"
            className="ep-mobile-cta"
            aria-label="Open research workspace"
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <footer className="ep-footer">
        <div className="ep-footer-inner">
          <Link href="/" className="ep-footer-brand">
            <Leaf size={17} />
            EonPulse Nepal
          </Link>
          <p>
            Exploring rainfall and vegetation response through Earth
            observation.
          </p>
          <div className="ep-footer-links">
            <Link href="/contents/overview">Research overview</Link>
            <Link href="/contents/methodology">Methods</Link>
            <Link href="/research/nepal">Workspace</Link>
          </div>
          <div className="ep-footer-note">
            <span className="ep-status-dot" />
            Research interface · Data integration in progress
          </div>
        </div>
      </footer>
    </div>
  );
}