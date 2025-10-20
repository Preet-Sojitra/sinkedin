import React from "react";

export default function PrivacyPolicy() {
  const SectionTitle = ({ children }) => (
    <h2 className="text-2xl font-semibold text-accent mt-8 mb-3">{children}</h2>
  );

  const ListItem = ({ children }) => (
    <li className="mb-2 ml-4 list-disc text-light-secondary">{children}</li>
  );

  return (
    <div className="bg-dark text-light min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-dark-secondary p-6 md:p-10 rounded-lg shadow-2xl border border-[color:var(--accent)]/30 prose prose-invert prose-headings:text-accent prose-a:text-accent hover:prose-a:text-red-400 prose-strong:text-light">
        <h1 className="text-3xl md:text-4xl font-bold text-accent mb-6 text-center !mt-0">
          Sinkedin: Privacy Policy (How We Handle Your Deepest, Darkest Career Secrets)
        </h1>

        <p className="text-light-secondary text-center italic">
          Last Updated: {new Date().toLocaleDateString()} (Probably when we last remembered this
          page exists)
        </p>

        <p className="mt-6">
          Welcome to Sinkedin's Privacy Policy. If you're reading this, you're either very thorough,
          very bored, or very paranoid. Good news for the paranoid: privacy (or at least, obscurity
          through anonymity) is kind of our jam. This policy explains what little data we bother to
          collect and how we pretend to protect it.
        </p>

        <SectionTitle>1. Information We "Collect" (If You Can Call It That)</SectionTitle>
        <p>
          We're not Big Brother. We're more like that weird cousin who remembers your most
          embarrassing moments.
        </p>
        <ul>
          <ListItem>
            <strong>Account Info (Optional & Minimal):</strong> If you sign up, maybe an email
            address (use a burner, we don't care) and a witty pseudonym. Your real name? We actively
            discourage it. Why would you?
          </ListItem>
          <ListItem>
            <strong>Your Epic Fail Posts:</strong> The glorious content you share. That's the whole
            point. It's public (within Sinkedin, anyway). Duh.
          </ListItem>
          <ListItem>
            <strong>Usage Data:</strong> Standard web server logs – IP addresses, browser type,
            pages visited. Mostly to see if the site is on fire (metaphorically, more than usual) or
            if anyone actually uses that one obscure feature.
          </ListItem>
          <ListItem>
            <strong>Cookies:</strong> Tiny digital crumbs. See below. We try not to make them too
            fattening for your browser.
          </ListItem>
        </ul>

        <SectionTitle>2. How We Use Your... Misery Data</SectionTitle>
        <p>We use this "data" for highly sophisticated purposes:</p>
        <ul>
          <ListItem>
            To run Sinkedin and let you share and view failures. Groundbreaking, we know.
          </ListItem>
          <ListItem>
            To (maybe, one day) show "trending fuckups" or "most relatable rejections."
          </ListItem>
          <ListItem>
            To ensure you're not a bot trying to sell us extended car warranties disguised as a
            layoff story.
          </ListItem>
          <ListItem>
            We are NOT in the business of selling your data. Who would buy this? And what would they
            even do with "Man Fails Job Interview Spectacularly #7892"?
          </ListItem>
        </ul>

        <SectionTitle>3. Anonymity & Pseudonymity: Your Best Friends</SectionTitle>
        <p>This is the core of Sinkedin. We WANT you to be anonymous or pseudonymous.</p>
        <ul>
          <ListItem>Don't use your real name unless you enjoy professional self-sabotage.</ListItem>
          <ListItem>
            Consider a VPN if you're truly dedicated to the art of obscure failure-sharing.
          </ListItem>
          <ListItem>
            The less identifiable information you provide, the better. We don't want it. You don't
            want us to have it. It's a win-win.
          </ListItem>
        </ul>

        <SectionTitle>4. Cookies (Not the Tasty Kind)</SectionTitle>
        <p>Yes, we use cookies. They're mostly for:</p>
        <ul>
          <ListItem>Keeping you logged in (if you bother to create an account).</ListItem>
          <ListItem>
            Remembering your preferences (like if you prefer your daily dose of despair extra dark).
          </ListItem>
          <ListItem>
            Basic site functionality. You can block them, but the site might act even more broken
            than intended.
          </ListItem>
        </ul>

        <SectionTitle>5. Third-Party Services (The Necessary Evils)</SectionTitle>
        <p>We might use some third-party services for things like:</p>
        <ul>
          <ListItem>Analytics (to see if more than 3 people are visiting).</ListItem>
          <ListItem>
            Hosting (because these stories have to live somewhere on the internet's grimy
            underbelly).
          </ListItem>
          <ListItem>
            We'll try to choose services that respect privacy, or at least pretend to as well as we
            do.
          </ListItem>
        </ul>

        <SectionTitle>
          6. Data Security (Or, "Our Best Effort, Which Isn't Saying Much")
        </SectionTitle>
        <p>
          We take reasonable measures to protect your information, like using HTTPS. But let's be
          honest, if highly skilled hackers are determined to steal your anonymous story about
          accidentally CC'ing your boss on a rant email, the world has bigger problems. Don't post
          state secrets here. Or your bank details. Or anything genuinely sensitive that isn't
          already a hilarious career failure.
        </p>

        <SectionTitle>7. Children's Privacy (Seriously, Kids, Go Play Outside)</SectionTitle>
        <p>
          Sinkedin is not intended for individuals under the age of 18 (or whatever the legal age is
          for appreciating soul-crushing corporate humor in your jurisdiction). If you're a kid,
          please don't use this site. Go fail at something fun, like skateboarding.
        </p>

        <SectionTitle>8. Changes to This Policy (When We Feel Like It)</SectionTitle>
        <p>
          We might update this Privacy Policy. We'll post changes here. Or we might forget. Check
          back if you're really invested. Which would be weird.
        </p>

        <hr className="my-8 border-[color:var(--accent)]/30" />

        <p className="text-sm text-light-secondary text-center font-bold">
          **MEGA IMPORTANT DISCLAIMER (AGAIN, BECAUSE LAWYERS):**
        </p>
        <p className="text-xs text-light-secondary text-center italic mb-4">
          Just like our Terms of Service, this Privacy Policy is a work of satire. It's meant to be
          humorous and reflect the spirit of Sinkedin. It is NOT a legally compliant Privacy Policy.
          If you need a real Privacy Policy for your own project, consult a legal professional who
          actually knows what they're doing. Seriously, don't use this as a template for anything
          important. We take no responsibility for your poor life choices. That's what Sinkedin is
          for *sharing*, not *creating more of*.
        </p>
      </div>
    </div>
  );
}
