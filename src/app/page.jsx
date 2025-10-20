"use client";

import Link from "next/link";
import { Briefcase, Users, MessageSquare, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <section className="bg-dark-secondary border-b border-[color:var(--accent)]">
        <div className="container mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl font-bold text-light mb-4">
                S
                <strike className="font-bold text-accent" style={{ color: "#e03131" }}>
                  in
                </strike>
                kedIn
              </h1>
              <p className="text-gray-400 text-base mb-6">
                Linkedin's Darker, Funnier and More Honest Cousin
              </p>
              <p className="text-gray-300 mb-8 text-lg">
                Job hunt got you feeling like a melted candle? LinkedIn feed look like a parade of
                humblebrags you can't relate to? <b>Welcome home.</b>
              </p>
              <div className="space-y-2 space-x-4 lg:space-y-0 lg:flex lg:space-x-4">
                <Link
                  href="/auth/signup"
                  className="bg-accent hover:bg-red-700 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
                >
                  Join the Disaster
                </Link>
                <Link
                  href="/feed"
                  className="bg-transparent hover:bg-accent/10 border-2 border-[color:var(--accent)] text-light px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
                >
                  Explore the Chaos
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              {/* Warning Box - reddish background and border */}
              <div className="bg-[rgba(224,49,49,0.12)] border border-[color:var(--accent)] rounded-lg p-6">
                <div className="flex items-start">
                  <div className="text-accent mr-3 mt-1">⚠️</div>
                  <div>
                    <h3 className="text-[color:var(--accent)] font-semibold mb-2">Fair Warning</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      This is the anti-LinkedIn. We swap horror stories, not business cards. Expect
                      dark humor, zero sugar-coating, and a healthy dose of schadenfreude. If you're
                      looking for motivational pep talks, you've taken a wrong turn at Albuquerque.
                      LinkedIn is down the hall, to the left, next to the crushing existential
                      dread.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-light">
            Why Choose{" "}
            <span className="text-light">
              S
              <strike className="text-accent font-bold" style={{ color: "#e03131" }}>
                in
              </strike>
              kedIn
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Briefcase className="w-8 h-8" />}
              title="Unleash Your Career Catastrophes"
              description="Got soul-crushing rejection letters? Interviewed with your fly down (we've all been there... maybe)? This is your stage. Your most cringeworthy moments are pure gold here."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Find Your Failure Family"
              description="You're not the only one whose career path looks like a toddler's scribbles. Connect with fellow 'professional disasters' who actually get it. No judgment, just shared pain and dark humor."
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8" />}
              title="Brace for Brutal (but Brilliant) Roasts"
              description="Post your professional predicaments and let the community serve up some lovingly harsh truths and witty takedowns. It's feedback, Sinkedin style – sharper, funnier, and surprisingly useful."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Master the Art of Anti-Success"
              description="Why make your own mistakes when you can learn from the glorious flameouts of others? Consider this your educational archive of career cautionary tales. It’s research... for what NOT to do."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-dark-secondary border-t border-[color:var(--accent)]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-light">Ready to Embrace the Chaos?</h2>
          <p className="text-light-secondary text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've given up on maintaining a perfect image. It's
            time to get real about your career disasters.
          </p>
          <Link
            href="/auth/signup"
            className="bg-accent hover:bg-red-700 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Start Your Downfall
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-dark-secondary border border-[color:var(--accent)] p-6 rounded-lg transition-colors">
      <div className="text-accent mb-4 flex justify-center">{icon}</div>
      <h3 className="text-light text-xl font-semibold mb-3">{title}</h3>
      <p className="text-light-secondary">{description}</p>
    </div>
  );
}
