import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | MyPath",
  description: "Legal terms and conditions for using the MyPath platform",
  icons: "/Logo/logo.svg",
};

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-light-white dark:bg-custom-dark-blue text-light-black dark:text-primary-text">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-text-blue/20 to-light-blue dark:from-logo-primary/20 dark:to-dark-logo-primary-gradient/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-blue dark:text-logo-primary text-center">
            Terms & Conditions
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
                Welcome to MyPath! These Terms and Conditions (
                <span className="text-dark-logo-primary">Terms</span>) govern your use of our
                website, mobile app, and related services (collectively, the
                <span className="text-dark-logo-primary"> Platform</span>). By using MyPath, you
                agree to these Terms.
              </p>
            </section>

            {/* Eligibility */}
            <section id="eligibility" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Who Can Use MyPath
              </h2>
              <ul className="mt-4 space-y-3 text-light-black/90 dark:text-secondary-text">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                    •
                  </span>
                  <span>You must be at least 13 years old to create an account.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                    •
                  </span>
                  <span>If you are under 18, you must have parental or guardian permission.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                    •
                  </span>
                  <span>
                    You agree to provide accurate, truthful information during registration.
                  </span>
                </li>
              </ul>
            </section>

            {/* User Account */}
            <section id="account" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                User Account & Responsibility
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                You are responsible for maintaining the confidentiality of your account credentials.
                You agree not to share your account or allow unauthorized access. You are
                responsible for all activity under your account.
              </p>
            </section>

            {/* Acceptable Use */}
            <section id="acceptable-use" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Acceptable Use Policy
              </h2>
              <p className="mt-4 mb-3 text-light-black/90 dark:text-secondary-text">
                <span className="font-semibold text-text-blue dark:text-logo-primary">
                  You agree not to:
                </span>
              </p>
              <ul className="space-y-3 text-light-black/90 dark:text-secondary-text">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                    •
                  </span>
                  <span>
                    Post or transmit{" "}
                    <span className="font-medium text-text-blue dark:text-logo-primary">
                      harmful, abusive, or offensive content
                    </span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                    •
                  </span>
                  <span>
                    Upload or share{" "}
                    <span className="font-medium text-text-blue dark:text-logo-primary">
                      false information
                    </span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                    •
                  </span>
                  <span>
                    Attempt to{" "}
                    <span className="font-medium text-text-blue dark:text-logo-primary">
                      hack, reverse-engineer, or damage
                    </span>{" "}
                    our systems
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                    •
                  </span>
                  <span>
                    Use the platform for{" "}
                    <span className="font-medium text-text-blue dark:text-logo-primary">
                      illegal or unauthorized purposes
                    </span>
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                We reserve the right to{" "}
                <span className="font-medium text-text-blue dark:text-logo-primary">
                  suspend or terminate
                </span>{" "}
                your account for violations of these rules.
              </p>
            </section>

            {/* Intellectual Property */}
            <section id="intellectual-property" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Intellectual Property
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                All content on the MyPath platform, including logos, software, text, and designs, is
                our intellectual property or licensed by us. You may not reproduce, distribute, or
                use our materials without permission.
              </p>
            </section>

            {/* Payments */}
            <section id="payments" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Payments & Subscriptions
              </h2>
              <div className="mt-4 p-5 rounded-lg bg-text-blue/8 dark:bg-logo-primary/8 border border-text-blue/20 dark:border-logo-primary/20">
                <ul className="space-y-3 text-light-black/90 dark:text-secondary-text">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      Certain services may require a{" "}
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        paid subscription
                      </span>
                      .
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      Payments are processed via{" "}
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        third-party services
                      </span>
                      .
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      We{" "}
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        do not store
                      </span>{" "}
                      your financial details.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      Subscriptions are billed{" "}
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        monthly or annually
                      </span>
                      , depending on your selection.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      You may{" "}
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        cancel your subscription
                      </span>{" "}
                      at any time, but{" "}
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        no refunds
                      </span>{" "}
                      will be issued for the current billing cycle.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Third-Party Services */}
            <section id="third-party" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Third-Party Services
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                Our platform may contain links to external websites or services. We are not
                responsible for the privacy or practices of third-party platforms.
              </p>
            </section>

            {/* Disclaimer */}
            <section id="disclaimer" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Disclaimer of Warranties
              </h2>
              <div className="mt-4 p-5 rounded-lg bg-text-blue/8 dark:bg-logo-primary/8 border border-text-blue/20 dark:border-logo-primary/20">
                <p className="text-light-black/90 dark:text-secondary-text mb-3">
                  MyPath is provided{" "}
                  <span className="font-medium text-text-blue dark:text-logo-primary">
                    <span className="text-dark-logo-primary">as is.</span>
                  </span>{" "}
                  We do not guarantee that:
                </p>
                <ul className="space-y-3 text-light-black/90 dark:text-secondary-text">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      The platform will be{" "}
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        error-free or uninterrupted
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-text-blue/20 dark:bg-logo-primary/20 text-text-blue dark:text-logo-primary mr-3 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>
                      The services will meet your{" "}
                      <span className="font-medium text-text-blue dark:text-logo-primary">
                        expectations or career outcomes
                      </span>
                    </span>
                  </li>
                </ul>
                <p className="mt-3 text-light-black/90 dark:text-secondary-text">
                  We{" "}
                  <span className="font-medium text-text-blue dark:text-logo-primary">
                    disclaim all warranties
                  </span>
                  , express or implied.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section id="liability" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Limitation of Liability
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                To the extent permitted by law, MyPath shall not be liable for any indirect,
                incidental, or consequential damages, including data loss, service interruption, or
                lost profits.
              </p>
            </section>

            {/* Termination */}
            <section id="termination" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Termination
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                We may suspend or terminate your access at any time if you violate these Terms. You
                may also delete your account at any time by contacting support.
              </p>
            </section>

            {/* Governing Law */}
            <section id="governing-law" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Governing Law
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                These Terms are governed by the laws of Pakistan. Any disputes shall be resolved in
                the courts of Lahore, Pakistan.
              </p>
            </section>

            {/* Contact Information */}
            <section id="contact" className="mb-12">
              <h2 className="text-2xl font-bold text-text-blue dark:text-logo-primary pb-2 border-b-2 border-text-blue/30 dark:border-logo-primary/30">
                Contact Information
              </h2>
              <p className="mt-4 text-light-black/90 dark:text-secondary-text">
                For any questions regarding these Terms, reach out to:
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
