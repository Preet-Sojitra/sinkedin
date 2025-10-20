import React from "react";

export default function TermsOfService() {
  const SectionTitle = ({ children }) => (
    <h2 className="text-2xl font-semibold text-accent mt-8 mb-3">{children}</h2>
  );

  const ListItem = ({ children }) => (
    <li className="mb-2 ml-4 list-disc text-light-secondary">{children}</li>
  );

  return (
    <div className="bg-dark text-light min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-dark-secondary p-6 md:p-10 rounded-lg shadow-2xl border border-[color:var(--accent)]/30 prose prose-invert prose-headings:text-accent prose-a:text-accent hover:prose-a:text-red-400 prose-strong:text-light">
        {/* Using prose-invert for better default text styling on dark backgrounds */}

        <h1 className="text-3xl md:text-4xl font-bold text-accent mb-6 text-center !mt-0">
          Sinkedin: Terms of Service (The "Rules of the Roast")
        </h1>

        <p className="text-light-secondary text-center italic">
          Last Updated: {new Date().toLocaleDateString()} (Because things might get even weirder)
        </p>

        <p className="mt-6">
          Welcome to Sinkedin ("us," "we," "the dumpster fire," or "Sinkedin.app")! This is where
          careers come to get a reality check, and epic fails get the spotlight they deserve. By
          accessing or using our magnificent platform of professional mishaps, you agree to be bound
          by these Terms. If you disagree with any part of these terms, then please, for the love of
          all that is holy, go back to LinkedIn.
        </p>

        <SectionTitle>1. Your Acceptance (Or, "You're Stuck With Us Now")</SectionTitle>
        <p>
          By creating an account or even just lurking, you're saying "Yes, I accept these
          beautifully crafted, not-at-all-serious terms." If you're using Sinkedin on behalf of an
          organization that also enjoys a good laugh at failure, they accept these terms too.
        </p>

        <SectionTitle>2. Content - Your Glorious Failures</SectionTitle>
        <p>
          You are responsible for the tales of woe, interview horror stories, and general career
          catastrophes you post ("User Content"). You own it. You live it. You (hopefully
          anonymously) share it.
        </p>
        <ul>
          <ListItem>
            You grant us a worldwide, non-exclusive, royalty-free license to display your User
            Content on Sinkedin. Basically, so others can revel in your misery.
          </ListItem>
          <ListItem>
            Don't post illegal stuff. Don't post copyrighted stuff that ain't yours. Don't post your
            boss's home address (no matter how much they deserve it).
          </ListItem>
          <ListItem>
            We can remove content if it's truly vile, breaks laws, or just bores us. Our platform,
            our rules. Mostly, we're here for the laughs, not the lawsuits.
          </ListItem>
        </ul>

        <SectionTitle>3. User Conduct (Or, "Don't Be a Total Jerk")</SectionTitle>
        <p>We're all here to bond over shared professional pain. Keep it that way.</p>
        <ul>
          <ListItem>
            Roasting is encouraged. Genuine bullying, hate speech, doxxing, or spamming your crypto
            scam? Instant ban. You'll be sunk deeper than your career prospects.
          </ListItem>
          <ListItem>
            Impersonating someone to make them look bad is a dick move. Impersonating someone to
            make them look like they achieved something on LinkedIn is... well, also a dick move,
            but that's their problem, not ours.
          </ListItem>
          <ListItem>Anonymity is a privilege, not a shield for douchebaggery.</ListItem>
        </ul>

        <SectionTitle>4. Account Termination (Or, "You're Fired!")</SectionTitle>
        <p>
          We reserve the right to suspend or terminate your account if you violate these terms, or
          if your continued presence just brings down the overall quality of our carefully curated
          chaos. You can also delete your account anytime you want to escape the void. No hard
          feelings (probably).
        </p>

        <SectionTitle>5. Disclaimers (Or, "We Promise Absolutely Nothing")</SectionTitle>
        <p>
          Sinkedin is provided "AS IS" and "AS AVAILABLE" without any warranties, express or
          implied.
        </p>
        <ul>
          <ListItem>
            We don't guarantee Sinkedin will help you get a job. It might do the opposite. Consider
            it exposure therapy.
          </ListItem>
          <ListItem>
            We don't guarantee the accuracy or hilarity of any user-generated content, though we
            have high hopes.
          </ListItem>
          <ListItem>
            This site is for entertainment. If you take career advice from anonymous roasts on the
            internet, that's on you, champ.
          </ListItem>
        </ul>

        <SectionTitle>6. Limitation of Liability (Or, "Don't Sue Us, Bro")</SectionTitle>
        <p>
          To the fullest extent permitted by applicable law, Sinkedin shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages, or any loss of profits
          or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill,
          or other intangible losses, resulting from your access to or use of or inability to access
          or use the service. In layman's terms: if using Sinkedin makes your life worse, we're
          sorry, but that's kind of the point, isn't it?
        </p>

        <SectionTitle>7. Changes to Terms (Or, "We Make the Rules Up As We Go")</SectionTitle>
        <p>
          We might change these terms from time to time. If we do, we'll try to let you know. Or
          not. Continued use after changes means you accept the new, probably even more ridiculous,
          terms.
        </p>

        <hr className="my-8 border-[color:var(--accent)]/30" />

        <p className="text-sm text-light-secondary text-center font-bold">
          **IMPORTANT REAL TALK DISCLAIMER:**
        </p>
        <p className="text-xs text-light-secondary text-center italic mb-4">
          This document is a parody. It's designed to be funny and fit the theme of Sinkedin. It is
          NOT a legally binding Terms of Service agreement drafted by a lawyer. If you're running a
          real platform and need actual legal documents, please hire a qualified legal professional.
          Don't copy this and think you're covered. You're not. You'll get sued. And we'll probably
          post about it on Sinkedin.
        </p>
      </div>
    </div>
  );
}
