import React from "react";

export default function Privacy() {
  const updated = "May 7, 2026";
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-xs uppercase tracking-[0.2em] text-amber">Legal</div>
      <h1 className="font-display text-5xl md:text-6xl mt-4 leading-[0.95]">
        Privacy <em className="text-amber not-italic">Policy</em>
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated {updated}</p>

      <div className="mt-10 rounded-2xl border hairline p-6 bg-card">
        <div className="font-display text-xl">The short version</div>
        <p className="mt-2 text-muted-foreground">
          LumenShade runs entirely in your browser. We don't track you, we don't
          sell anything to advertisers, and we don't need an account for the
          extension to work. Your settings live on your device.
        </p>
      </div>

      <Section title="What we collect">
        <p>
          The LumenShade browser extension does not transmit your browsing
          history, page contents, or per-site settings to our servers. Color
          conversion happens locally in your browser.
        </p>
        <p className="mt-3">
          Our marketing website (this site) uses minimal, privacy-respecting
          analytics to count anonymous page views. No cookies are used to
          identify you across sites.
        </p>
      </Section>

      <Section title="Account &amp; payments (Pro)">
        <p>
          If you purchase a Pro plan, our payment processor handles your card
          details — we never see them. We store your email address and
          subscription status to validate your license.
        </p>
        <p className="mt-3">
          Cloud sync of your settings is opt-in. When enabled, your preferences
          are end-to-end encrypted with a key derived from your password; we
          cannot read them.
        </p>
      </Section>

      <Section title="Permissions the extension requests">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Access to page contents</strong> — required to read computed
            styles and inject the dark theme. Used locally; never transmitted.
          </li>
          <li>
            <strong>Storage</strong> — saves your per-site preferences in the
            browser's local storage.
          </li>
        </ul>
      </Section>

      <Section title="Third parties">
        <p>
          We use Stripe (payments), and a privacy-respecting analytics provider
          for the marketing site. We do not share data with advertisers and we
          do not sell user data — ever.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          You can export or delete your account data at any time by emailing{" "}
          <a href="mailto:privacy@lumenshade.app" className="text-amber hover:underline">
            privacy@lumenshade.app
          </a>
          . If you're in the EU/UK, you have GDPR rights including access,
          correction, and erasure.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          If we make material changes, we'll update this page and bump the date
          at the top. Continued use of the extension or site means you accept
          the updated policy.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions? Email{" "}
          <a href="mailto:privacy@lumenshade.app" className="text-amber hover:underline">
            privacy@lumenshade.app
          </a>
          .
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}
