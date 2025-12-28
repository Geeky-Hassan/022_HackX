import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | MyPath",
  description: "Privacy policy for using the MyPath platform",
  icons: "/Logo/logo.svg",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-light-white dark:bg-custom-dark-blue text-light-black dark:text-primary-text">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-text-blue/20 to-light-blue dark:from-logo-primary/20 dark:to-dark-logo-primary-gradient/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-blue dark:text-logo-primary text-center">
            Privacy Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="prose prose-blue max-w-none dark:prose-invert">
            {/* Introduction */}
            <section id="introduction" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Introduction
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                Welcome to MyPath! Your privacy is important to us. This Privacy Policy outlines how
                we collect, use, and protect your personal information when you access or use our
                website, mobile app, and services.
              </p>
            </section>

            {/* Who We Are */}
            <section id="who-we-are" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Who We Are
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                MyPath is an EdTech platform designed to provide personalized academic, career, and
                mental health support for students across Pakistan. This policy applies to all
                services provided by MyPath (<span className="text-dark-logo-primary">we</span>,
                <span className="text-dark-logo-primary">us</span>, or{" "}
                <span className="text-dark-logo-primary">our</span>).
              </p>
            </section>

            {/* Information We Collect */}
            <section id="information-we-collect" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Information We Collect
              </h2>
              <p className="mt-4 mb-3 text-light-black/90 dark:text-secondary-text">
                We may collect the following types of information:
              </p>

              <div className="mt-6 mb-6">
                <h3 className="text-xl font-semibold text-text-blue dark:text-logo-primary mb-3">
                  a. Personal Information
                </h3>
                <ul className="space-y-3 text-light-black/90 dark:text-secondary-text">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Full name
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Email address
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Phone number
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Date of birth
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Educational level or institution
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Resume details
                      </span>{" "}
                      (if uploaded)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Payment details
                      </span>{" "}
                      (processed securely through third-party gateways)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 mb-6">
                <h3 className="text-xl font-semibold text-text-blue dark:text-logo-primary mb-3">
                  b. Usage Data
                </h3>
                <ul className="space-y-3 text-light-black/90 dark:text-secondary-text">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Log-in times and session duration
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Features accessed
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Device and browser information
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        IP address and geolocation
                      </span>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 mb-6">
                <h3 className="text-xl font-semibold text-text-blue dark:text-logo-primary mb-3">
                  c. Communications
                </h3>
                <ul className="space-y-3 text-light-black/90 dark:text-secondary-text">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Messages sent through our platform
                      </span>{" "}
                      (e.g., to advisors or within discussion forums)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Emails or support queries
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section id="how-we-use-information" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                How We Use Your Information
              </h2>
              <p className="mt-4 mb-3 text-light-black/90 dark:text-secondary-text">
                We use your information to:
              </p>
              <div className="p-5 rounded-lg bg-text-blue/8 dark:bg-logo-primary/8 border border-text-blue/20 dark:border-logo-primary/20">
                <ul className="space-y-3 text-light-black/90 dark:text-secondary-text">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Provide and personalize our services
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Create and manage your user account
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Match you with suitable mentors, events, and content
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Improve the quality of our platform
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Send you updates, alerts, and service notifications
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Respond to your queries or feedback
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        Comply with legal obligations
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Sharing Your Information */}
            <section id="sharing-information" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Sharing Your Information
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                We{" "}
                <span className="font-medium text-text-blue dark:text-logo-primary">
                  do not sell
                </span>{" "}
                your personal data. We may share limited data:
              </p>
              <ul className="mt-4 space-y-3 text-light-black/90 dark:text-secondary-text">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                    •
                  </span>
                  <span>
                    With{" "}
                    <span className="font-medium text-text-blue dark:text-logo-primary">
                      service providers
                    </span>{" "}
                    (e.g., hosting, analytics, or payment gateways)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                    •
                  </span>
                  <span>
                    With your{" "}
                    <span className="font-medium text-text-blue dark:text-logo-primary">
                      explicit consent
                    </span>{" "}
                    (e.g., sharing your resume with career partners)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                    •
                  </span>
                  <span>
                    When{" "}
                    <span className="font-medium text-text-blue dark:text-logo-primary">
                      required by law
                    </span>{" "}
                    or legal authorities
                  </span>
                </li>
              </ul>
            </section>

            {/* Data Storage & Security */}
            <section id="data-security" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Data Storage & Security
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                Your data is stored securely using{" "}
                <span className="font-medium text-text-blue dark:text-logo-primary">
                  encrypted systems
                </span>{" "}
                on trusted cloud providers. We take appropriate security measures to protect your
                data from unauthorized access, disclosure, or destruction.
              </p>
            </section>

            {/* Your Rights & Choices */}
            <section id="your-rights" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Your Rights & Choices
              </h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-text-blue/8 dark:bg-logo-primary/8 border border-text-blue/20 dark:border-logo-primary/20">
                  <h3 className="font-semibold text-text-blue dark:text-logo-primary mb-2">
                    Access
                  </h3>
                  <p className="text-light-black/90 dark:text-secondary-text">
                    You can request a copy of your personal data.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-text-blue/8 dark:bg-logo-primary/8 border border-text-blue/20 dark:border-logo-primary/20">
                  <h3 className="font-semibold text-text-blue dark:text-logo-primary mb-2">
                    Correction
                  </h3>
                  <p className="text-light-black/90 dark:text-secondary-text">
                    You may update or correct your personal information at any time.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-text-blue/8 dark:bg-logo-primary/8 border border-text-blue/20 dark:border-logo-primary/20">
                  <h3 className="font-semibold text-text-blue dark:text-logo-primary mb-2">
                    Deletion
                  </h3>
                  <p className="text-light-black/90 dark:text-secondary-text">
                    You can request that your account be deleted.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-text-blue/8 dark:bg-logo-primary/8 border border-text-blue/20 dark:border-logo-primary/20">
                  <h3 className="font-semibold text-text-blue dark:text-logo-primary mb-2">
                    Opt-Out
                  </h3>
                  <p className="text-light-black/90 dark:text-secondary-text">
                    You can opt-out of marketing emails via the unsubscribe link.
                  </p>
                </div>
              </div>
            </section>

            {/* Children's Privacy */}
            <section id="childrens-privacy" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Children&apos;s Privacy
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                Our services are intended for users aged{" "}
                <span className="font-medium text-text-blue dark:text-logo-primary">
                  13 and above
                </span>
                . If you are under 13, please do not provide personal data without parental consent.
              </p>
            </section>

            {/* Cookies & Tracking */}
            <section id="cookies" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Cookies & Tracking
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                We use cookies to enhance your browsing experience and collect anonymized data for
                analytics. You can disable cookies in your browser settings, but some features may
                not function correctly.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section id="changes" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Changes to This Policy
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                We may update this Privacy Policy. When we do, we will revise the{" "}
                <span className="text-dark-logo-primary">Effective Date</span> above and notify you
                via email or platform alert.
              </p>
            </section>

            {/* Contact Us */}
            <section id="contact" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Contact Us
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                If you have any questions or concerns about your privacy, please contact:
              </p>
              <div className="mt-4 p-5 rounded-lg bg-text-blue/8 dark:bg-logo-primary/8 border border-text-blue/20 dark:border-logo-primary/20">
                <p className="text-text-blue dark:text-logo-primary font-medium">
                  Email:{" "}
                  <a
                    href="mailto:info@mypath.one"
                    className="underline hover:text-text-blue/80 dark:hover:text-logo-primary/80 transition-colors"
                  >
                    info@mypath.one
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
