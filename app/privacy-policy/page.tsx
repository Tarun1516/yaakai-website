"use client"

import { useEffect } from "react"
import BackButton from "@/components/BackButton"

export default function PrivacyPolicyPage() {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      <BackButton returnToSignup={true} />

      <div className="bg-white p-8 rounded-lg shadow-md mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy for Yaakai</h1>
        <p className="text-gray-500 mb-6 text-center">Last Updated: 30.4.2025, 11.45AM(IST)</p>

        <div className="prose max-w-none">
          <p>
            Welcome to Yaakai! This Privacy Policy explains how Yaakai ("Yaakai", "we", "us", or "our") collects, uses,
            discloses, and protects your personal information when you use our software-as-a-service application and
            website located at yaakai.me (collectively, the "Service").
          </p>
          <p>
            We are committed to protecting your privacy and handling your data in an open and transparent manner. This
            Privacy Policy is designed to comply with applicable data protection laws in India, including the Digital
            Personal Data Protection Act, 2023 (DPDPA) and the Information Technology Act, 2000, including the
            Information Technology (Reasonable security practices and procedures and sensitive personal data or
            information) Rules, 2011 (SPDI Rules).
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using the Service, you signify your understanding
            and agreement with the collection, processing, use, and disclosure of your personal information as described
            in this Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">1. Data Fiduciary Information</h2>
          <p>
            For the purposes of applicable data protection law, Yaakai is the Data Fiduciary responsible for the
            processing of your personal data collected through the Service.
          </p>
          <p>Our contact details are: Email: yaakai1516@gmail.com Website: yaakai.me</p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">2. Information We Collect (Personal Data)</h2>
          <p>
            We collect information that identifies, relates to, describes, is reasonably capable of being associated
            with, or could reasonably be linked, directly or indirectly, with a particular individual ("Personal Data").
            The types of Personal Data we may collect include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Account Information:</strong> When you register for an account, we collect information such as
              your name, email address, username, and password. Passwords are treated as sensitive personal data and are
              stored securely (hashed).
            </li>
            <li>
              <strong>Communication Data:</strong> If you contact us directly (for support), we may receive additional
              information about you such as your name, email address, phone number (optional), the contents of the
              message and/or attachments you may send us, and any other information you may choose to provide.
            </li>
            <li>
              <strong>Payment Information:</strong> Yaakai does not typically store full payment card details but may
              retain payment details and transaction history.
            </li>
            <li>
              <strong>Usage Data:</strong> We automatically collect certain information when you visit, use, or navigate
              the Service. This information may include your IP address, browser type, operating system, device
              information, referring URLs, pages viewed, time spent on pages, links clicked, and other usage statistics.
              This data helps us understand how users interact with our Service and improve it.
            </li>
            <li>
              <strong>User Content:</strong> Any data, text, files, or other information you input, upload, or store
              within the Yaakai application as part of using the Service.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">3. How We Use Your Information (Purpose of Processing)</h2>
          <p>We use the Personal Data we collect for various purposes, based on lawful grounds, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>To Provide and Maintain the Service:</strong> To create and manage your account, allow you to log
              in, provide access to features, process your application data, and ensure the Service operates correctly.
            </li>
            <li>
              <strong>To Process Transactions:</strong> To process your subscription payments and manage your
              subscription (if applicable).
            </li>
            <li>
              <strong>To Improve and Personalize the Service:</strong> To understand usage patterns, analyze trends,
              identify popular features, diagnose technical issues, develop new features, and personalize your
              experience.
            </li>
            <li>
              <strong>To Communicate With You:</strong> To send you important service-related notices (e.g., updates,
              security alerts, technical issues), respond to your inquiries and support requests, and provide customer
              service.
            </li>
            <li>
              <strong>To Ensure Security and Integrity:</strong> To detect and prevent fraudulent activity, unauthorized
              access, security incidents, and other misuse of the Service.
            </li>
            <li>
              <strong>To Comply with Legal Obligations:</strong> To comply with applicable laws, regulations, legal
              processes, or governmental requests in India.
            </li>
            <li>
              <strong>To Enforce Our Terms:</strong> To enforce our Terms and Conditions and other policies.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">4. Legal Basis for Processing</h2>
          <p>Under the DPDPA, we process your Personal Data based on the following legal grounds:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Consent:</strong> We process your Personal Data based on your explicit consent, obtained at the
              time of collection (e.g., when you sign up for an account or agree to this Privacy Policy). You provide
              consent through a clear affirmative action.
            </li>
            <li>
              <strong>Legitimate Uses:</strong> In certain limited circumstances, we may process Personal Data for
              specified legitimate uses where consent may not be required under the DPDPA. We will only rely on
              legitimate uses where permitted by law and where such processing does not override your rights and
              interests.
            </li>
            <li>
              <strong>Performance of Contract:</strong> Processing necessary to provide the Service you have requested
              and fulfill our obligations under the Terms and Conditions.
            </li>
            <li>
              <strong>Legal Obligation:</strong> Processing necessary to comply with our legal and regulatory
              obligations under Indian law.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">5. Consent</h2>
          <p>
            Where we rely on consent for processing your Personal Data, we will obtain it through clear, specific,
            informed, and unambiguous means, typically requiring a clear affirmative action from you (like ticking a box
            or clicking "Agree") before or at the point of collecting your data. We will provide you with a notice
            detailing the data being collected, the purpose of processing, how you can exercise your rights, and how to
            make a complaint to the Data Protection Board.
          </p>
          <p>
            You have the right to withdraw your consent at any time. You can withdraw consent by deleting your account
            in the profile page of your account, or by contacting us at yaakai1516@gmail.com. Withdrawing consent will
            not affect the lawfulness of processing based on consent before its withdrawal. Upon withdrawal, we will
            cease processing your data for the purposes you consented to, unless another legal basis applies.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">6. Information Sharing and Disclosure</h2>
          <p>
            We do not sell your Personal Data. We may share your Personal Data with third parties only in the following
            circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Service Providers:</strong> We engage third-party companies and individuals to perform services on
              our behalf payment processors, email delivery services). These service providers have access to your
              Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for
              any other purpose. We require them to implement appropriate security measures.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your Personal Data if required to do so by law or in
              response to valid requests by public authorities (e.g., a court or a government agency) in India.
            </li>
            <li>
              <strong>Business Transfers:</strong> If Yaakai is involved in a merger, acquisition, or asset sale, your
              Personal Data may be transferred. We will provide notice before your Personal Data is transferred and
              becomes subject to a different Privacy Policy.
            </li>
            <li>
              <strong>Protection of Rights:</strong> We may disclose information where we believe it is necessary to
              investigate, prevent, or take action regarding potential violations of our policies, suspected fraud,
              situations involving potential threats to the safety of any person, violations of our Terms and
              Conditions, or as evidence in litigation in which we are involved.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may disclose your Personal Data for any other purpose with your
              explicit consent.
            </li>
          </ul>
          <p>
            <strong>Cross-Border Data Transfers:</strong> If we transfer Personal Data outside of India, we will ensure
            compliance with Indian laws, potentially restricting transfers to countries notified by the Central
            Government as providing adequate levels of data protection, or ensuring appropriate safeguards are in place
            as required by law.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">7. Data Security</h2>
          <p>
            We implement reasonable security practices and procedures, including technical, administrative, and physical
            safeguards, designed to protect your Personal Data from unauthorized access, use, alteration, or
            destruction. These measures include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Encryption of data in transit (e.g., using SSL/TLS).</li>
            <li>Use of secure cloud infrastructure.</li>
            <li>Restricted access to Personal Data based on roles and responsibilities.</li>
            <li>Regular security assessments and updates.</li>
          </ul>
          <p>
            However, no internet or email transmission is ever fully secure or error-free. While we strive to protect
            your Personal Data, we cannot guarantee its absolute security. In the event of a personal data breach, we
            will notify the Data Protection Board of India and affected Data Principals as required by the DPDPA.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">8. Data Retention</h2>
          <p>
            We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy
            Policy, unless a longer retention period is required or permitted by law.
          </p>
          <p>Generally, this means we retain your data as long as your Yaakai account is active.</p>
          <p>
            When we have no ongoing legitimate business need to process your Personal Data (account closure, purpose
            fulfillment), we will either delete or anonymize it, or, if this is not possible (because your Personal Data
            has been stored in backup archives), then we will securely store your Personal Data and isolate it from any
            further processing until deletion is possible.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">9. Your Rights as a Data Principal</h2>
          <p>
            Under the DPDPA, you have certain rights regarding your Personal Data. Subject to applicable conditions and
            exceptions, these rights include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Right to Access Information:</strong> You have the right to request confirmation of whether we
              process your Personal Data and access to the information we hold about you, including a summary of the
              data processed, processing activities, and identities of third parties with whom data has been shared.
            </li>
            <li>
              <strong>Right to Correction and Erasure:</strong> You have the right to request the correction of
              inaccurate or incomplete Personal Data and the erasure of Personal Data that is no longer necessary for
              the purpose it was collected, subject to legal retention requirements.
            </li>
            <li>
              <strong>Right to Grievance Redressal:</strong> You have the right to have your grievances addressed
              regarding the processing of your Personal Data.
            </li>
            <li>
              <strong>Right to Withdraw Consent:</strong> As mentioned above, you can withdraw your previously given
              consent for data processing at any time.
            </li>
            <li>
              <strong>Right to Nominate:</strong> You have the right to nominate another individual to exercise your
              rights on your behalf in the event of your death or incapacity.
            </li>
          </ul>

          <p>
            To exercise any of these rights, please contact us at yaakai1516@gmail.com. We will respond to your request
            within the timeframes prescribed by law.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">10. Grievance Redressal</h2>
          <p>
            If you have any questions, concerns, or complaints about this Privacy Policy or our data handling practices,
            please contact our Grievance Officer at:
          </p>
          <p>Email: yaakai1516@gmail.com</p>
          <p>
            We will endeavor to address your concerns promptly. If you are not satisfied with our response, you have the
            right to lodge a complaint with the Data Protection Board of India after exhausting our internal grievance
            redressal mechanism.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">11. Children's Privacy</h2>
          <p>
            The Service is not intended for use by individuals under the age of sixteen (16). We do not knowingly
            collect Personal Data from children under 16. If we become aware that we have collected Personal Data from a
            child under 16 without verification of parental consent (where applicable under law for those under 18), we
            will take steps to remove that information from our servers.
          </p>
          <p>
            If you are a parent or guardian and you are aware that your child under 16 has provided us with Personal
            Data, please contact us immediately at yaakai1516@gmail.com.
          </p>
          <p>
            Note: The DPDPA defines a "child" as an individual under the age of 18. Processing data of children requires
            verifiable parental consent and is subject to specific restrictions. By setting our age limit at 16, we aim
            to avoid processing data from individuals legally defined as children without appropriate consent
            mechanisms.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">12. Cookies and Tracking Technologies</h2>
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store
            information. Specific information about how we use such technologies and how you can refuse certain cookies
            is set out in our Cookie Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">13. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date. For material changes, we may provide more
            prominent notice (such as by adding a statement to our homepage or sending you an email notification).
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
            are effective when they are posted on this page.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">14. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us: By email: yaakai1516@gmail.com</p>

          <p className="mt-8 text-sm text-gray-500">
            Legal Disclaimer: This Privacy Policy is provided for informational purposes only and does not constitute
            legal advice. Yaakai strongly recommends that you consult with a qualified legal professional in India to
            review this policy and ensure it meets your specific business needs and complies fully with all applicable
            laws and regulations before publishing it on your website.
          </p>
        </div>
      </div>
    </div>
  )
}
