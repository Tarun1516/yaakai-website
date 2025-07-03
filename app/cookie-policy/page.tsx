"use client"

import { useEffect } from "react"
import BackButton from "@/components/BackButton"

export default function CookiePolicyPage() {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      <BackButton returnToSignup={true} />

      <div className="bg-white p-8 rounded-lg shadow-md mt-10">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy for Yaakai</h1>
        <p className="text-gray-600 mb-8">Last Updated: 30.4.2025, 11.45AM(IST)</p>

        <div className="prose max-w-none">
          <p>
            This Cookie Policy explains how Yaakai ("Yaakai", "we", "us", or "our") uses cookies and similar tracking
            technologies when you visit our website yaakai.me or use our software-as-a-service application
            (collectively, the "Service"). This policy should be read alongside our Privacy Policy, which provides more
            detailed information about how we collect, use, and protect your personal data.
          </p>
          <p>
            By using our Service, you may be asked to consent to our use of cookies in accordance with this policy and
            applicable Indian law, including the Digital Personal Data Protection Act, 2023 (DPDPA).
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">1. What are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website.
            They are widely used to make websites work, or work more efficiently, as well as to provide information to
            the owners of the site.
          </p>
          <p>
            Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you go
            offline, while session cookies are deleted as soon as you close your web browser.
          </p>
          <p>
            We may also use similar tracking technologies, such as web beacons, pixels, and local storage, to collect
            and store information about your use of the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">2. How We Use Cookies</h2>
          <p>We use cookies and similar technologies for several purposes, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Essential Operations:</strong> To operate our Service, such as allowing you to log in, maintaining
              session integrity, and ensuring security.
            </li>
            <li>
              <strong>Preferences:</strong> To remember your settings and preferences (language) and provide enhanced,
              personalized features.
            </li>
            <li>
              <strong>Performance and Analytics:</strong> To understand how visitors interact with our Service, analyze
              website traffic, identify popular features, diagnose technical issues, and improve the overall user
              experience.
            </li>
            <li>
              <strong>Functionality:</strong> To enable certain functions of the Service and provide specific features.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">3. Types of Cookies We Use</h2>
          <p>
            We use the following types of cookies on our Service. Please note that the specific cookies used may change
            over time as we improve and update our Service. We will obtain your explicit consent before deploying
            non-essential cookies.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Strictly Necessary Cookies:</strong>
              <ul className="list-disc pl-6 mb-2">
                <li>
                  <strong>Purpose:</strong> These cookies are essential for you to browse the website and use its
                  features, such as accessing secure areas of the site or maintaining your login session. Without these
                  cookies, the Service cannot be provided properly.
                </li>
                <li>
                  <strong>Consent:</strong> These cookies do not require your consent under applicable law as they are
                  essential for the operation of the Service.
                </li>
                <li>
                  <strong>Duration:</strong> Typically session cookies.
                </li>
              </ul>
            </li>
            <li>
              <strong>Performance and Analytics Cookies:</strong>
              <ul className="list-disc pl-6 mb-2">
                <li>
                  <strong>Purpose:</strong> These cookies collect information about how you use our Service, such as
                  which pages you visit most often, how long you spend on a page, and if you encounter any errors. This
                  information helps us improve how our Service works.
                </li>
                <li>
                  <strong>Consent:</strong> We will ask for your explicit consent before placing these cookies on your
                  device.
                </li>
              </ul>
            </li>
            <li>
              <strong>Functionality Cookies:</strong>
              <ul className="list-disc pl-6 mb-2">
                <li>
                  <strong>Purpose:</strong> These cookies allow the Service to remember choices you make (such as your
                  username, language, or the region you are in) and provide enhanced, more personal features.
                </li>
                <li>
                  <strong>Consent:</strong> We will ask for your explicit consent before placing these cookies on your
                  device.
                </li>
                <li>
                  <strong>Duration:</strong> Can be session or persistent.
                </li>
              </ul>
            </li>
            <li>
              <strong>Targeting/Advertising Cookies:</strong>
              <ul className="list-disc pl-6 mb-2">
                <li>
                  <strong>Purpose:</strong> Yaakai does not currently use targeting or advertising cookies to track your
                  browsing habits across different websites or deliver targeted advertising. If this changes in the
                  future, we will update this policy and obtain your explicit consent.
                </li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">4. Third-Party Cookies</h2>
          <p>
            We may use third-party service providers, such as Google Analytics, to help us analyze how our Service is
            used. These third parties may place their own cookies on your device.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Google Analytics:</strong> We use Google Analytics to collect information about website usage.
              Google Analytics collects information such as how often users visit the site, what pages they visit, and
              what other sites they used prior to coming to our site. We use this information only to improve our
              Service. Google Analytics collects only the IP address assigned to you on the date you visit the site,
              rather than your name or other identifying information. Google's ability to use and share information
              collected by Google Analytics about your visits to this site is restricted by the Google Analytics Terms
              of Use and the Google Privacy Policy. You can prevent Google Analytics from recognizing you on return
              visits to this site by disabling cookies on your browser.
            </li>
          </ul>
          <p>
            Please review the privacy policies of these third parties for more information on their cookie practices.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">5. Your Choices and Managing Cookies</h2>
          <p>
            In compliance with the DPDPA, we require your explicit, informed consent before placing any non-essential
            cookies on your device. When you first visit our website, you will be presented with a cookie consent banner
            or tool where you can manage your preferences.
          </p>
          <p>You can typically manage cookies through your web browser settings. Most browsers allow you to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>See what cookies you have and delete them individually.</li>
            <li>Block third-party cookies.</li>
            <li>Block cookies from particular sites.</li>
            <li>Block all cookies from being set.</li>
            <li>Delete all cookies when you close your browser.</li>
          </ul>
          <p>
            Please note that if you choose to block or delete cookies, some features of our Service may not function
            properly or your preferences may be lost.
          </p>
          <p>
            To find out more about cookies, including how to see what cookies have been set and how to manage and delete
            them, visit www.aboutcookies.org or www.allaboutcookies.org.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">6. Consent under DPDPA</h2>
          <p>
            As required by the DPDPA, your consent for the use of non-essential cookies must be freely given, specific,
            informed, unconditional, and unambiguous, signified by a clear affirmative action. Our cookie consent
            mechanism is designed to meet these requirements, providing you with clear information about the cookies we
            use and their purposes before you make a choice.
          </p>
          <p>
            You have the right to withdraw your consent at any time through the same mechanism you used to provide it
            (e.g., our cookie consent tool) or by adjusting your browser settings. Withdrawing consent will not affect
            the lawfulness of processing based on consent before its withdrawal.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">7. Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other
            operational, legal, or regulatory reasons. We will notify you of any significant changes by posting the new
            policy on our website and updating the "Last Updated" date.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or this Cookie Policy, please contact us at
            yaakai1516@gmail.com or refer to our Privacy Policy.
          </p>

          <p className="mt-8 text-sm text-gray-500">
            Legal Disclaimer: This Cookie Policy is provided for informational purposes only and does not constitute
            legal advice. Yaakai strongly recommends that you consult with a qualified legal professional in India to
            review this policy, ensure it accurately reflects the cookies used by your specific service, and complies
            fully with all applicable laws and regulations before publishing it.
          </p>
        </div>
      </div>
    </div>
  )
}
