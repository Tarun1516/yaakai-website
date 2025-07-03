"use client"

import { useEffect } from "react"
import BackButton from "@/components/BackButton"

export default function TermsAndConditionsPage() {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      <BackButton returnToSignup={true} />

      <div className="bg-white p-8 rounded-lg shadow-md mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions for Yaakai</h1>
        <p className="text-gray-500 mb-6 text-center">Last Updated: 30.4.2025, 11.45AM(IST)</p>

        <div className="prose max-w-none">
          <p>
            Welcome to Yaakai! These Terms and Conditions ("Terms") govern your access to and use of the Yaakai
            software-as-a-service application and website (collectively, the "Service"), located at yaakai.me and
            operated by Yaakai ("Yaakai", "we", "us", or "our"). Please read these Terms carefully before using the
            Service.
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do
            not agree to these Terms or the Privacy Policy, you may not access or use the Service. These Terms
            constitute a legally binding agreement between you and Yaakai.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">1. Description of Service</h2>
          <p>
            Yaakai provides a software-as-a-service designed for build and sell unique products that do not exists in
            the market. The specific features and functionalities available may vary depending upon the product that you
            choose.
          </p>
          <p>
            We reserve the right to modify, suspend, or discontinue the Service, or any part thereof, with or without
            notice at any time. We will not be liable to you or any third party for any modification, suspension, or
            discontinuance of the Service. We may also impose limits on certain features or restrict your access to
            parts or all of the Service without notice or liability.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">2. Eligibility and Age Restriction</h2>
          <p>
            The Service is intended solely for users who are sixteen (16) years of age or older. Any registration by,
            use of, or access to the Service by anyone under 16 is unauthorized, unlicensed, and in violation of these
            Terms. By using the Service, you represent and warrant that you are 16 years of age or older and that you
            agree to and abide by all of the terms and conditions of this Agreement. If you are using the Service on
            behalf of an entity, organization, or company, you represent and warrant the Service on behalf of an entity,
            organization, or company, you represent and warrant that you have the authority to bind that entity to these
            Terms, and you agree to be bound by these Terms on behalf of that entity.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">3. User Accounts</h2>
          <p>
            To access certain features of the Service, you may be required to register for an account. When you register
            for an account, you agree to provide accurate, current, and complete information as prompted by the
            registration form. You also agree to maintain and promptly update your registration information to keep it
            accurate, current, and complete.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account password and for all activities that
            occur under your account. You agree to notify us immediately at yaakai1516@gmail.com of any unauthorized use
            of your account or any other breach of security. Yaakai will not be liable for any loss or damage arising
            from your failure to comply with this section.
          </p>
          <p>
            We reserve the right to suspend or terminate your account if any information provided during the
            registration process or thereafter proves to be inaccurate, not current, or incomplete, or if you violate
            these Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">4. Acceptable Use</h2>
          <p>
            You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to
            use the Service:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              In any way that violates any applicable central, state, local, or international law or regulation
              (including, without limitation, any laws regarding the export of data or software and data piracy).
            </li>
            <li>
              For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way, including by
              exposing them to inappropriate content or asking for personally identifiable information.
            </li>
            <li>
              To transmit, or procure the sending of, any advertising or promotional material, including any "junk
              mail," "chain letter," "spam," or any other similar solicitation.
            </li>
            <li>
              To impersonate or attempt to impersonate Yaakai, a Yaakai employee, another user, or any other person or
              entity.
            </li>
            <li>
              To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or
              which, as determined by us, may harm Yaakai or users of the Service or expose them to liability.
            </li>
          </ul>
          <p>Additionally, you agree not to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Use the Service in any manner that could disable, overburden, damage, or impair the site or interfere with
              any other party's use of the Service.
            </li>
            <li>
              Use any robot, spider, or other automatic device, process, or means to access the Service for any purpose,
              including monitoring or copying any of the material on the Service.
            </li>
            <li>
              Use any manual process to monitor or copy any of the material on the Service or for any other unauthorized
              purpose without our prior written consent.
            </li>
            <li>Use any device, software, or routine that interferes with the proper working of the Service.</li>
            <li>
              Introduce any viruses, trojan horses, worms, logic bombs, or other material that is malicious or
              technologically harmful.
            </li>
            <li>
              Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service, the
              server on which the Service is stored, or any server, computer, or database connected to the Service.
            </li>
            <li>Attack the Service via a denial-of-service attack or a distributed denial-of-service attack.</li>
            <li>Otherwise attempt to interfere with the proper working of the Service.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">5. Payment Terms</h2>
          <p>
            Access to certain features or products within the Service may require payment of fees ("Product Fees"). All
            fees are quoted in Indian Rupees (INR). You agree to pay all applicable Product Fees for the product or
            feature you select. We may use a third-party payment processor to bill you through a payment account linked
            to your account.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Payment:</strong> Product Fees are typically billed as a one-time charge or as specified at the
              time of purchase based upon the product that you choose.
            </li>
            <li>
              <strong>Price Changes:</strong> We reserve the right to change the Product Fees at any time. We will
              provide you with reasonable prior notice of any price changes.
            </li>
            <li>
              <strong>Cancellation:</strong> If you wish to cancel your purchase of a product, you are allowed to
              request a cancellation within seven (7) days of the payment date by contacting us at yaakai1516@gmail.com.
            </li>
            <li>
              <strong>Refunds:</strong> If a product purchase is cancelled within the allowed seven (7) day period, a
              refund will typically be processed within 5-7 business days to your original payment method, unless
              otherwise required by law or determined by us in our sole discretion, in additional if the product doesn't
              work or there is any malfunction in working, all functions issues related to the working of the product by
              raising complaint the money will be refunded to you having the permission to use the product that you
              purchased for lifetime.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">6. Intellectual Property Rights</h2>
          <p>
            The Service and its entire contents, features, and functionality (including but not limited to all
            information, software, text, displays, images, video, and audio, and the design, selection, and arrangement
            thereof) are owned by Yaakai, its licensors, or other providers of such material and are protected by Indian
            and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary
            rights laws.
          </p>
          <p>
            These Terms permit you to use the Service for your personal or internal business use only, subject to the
            terms of your subscription. You must not reproduce, distribute, modify, create derivative works of, publicly
            display, publicly perform, republish, download, store, or transmit any of the material on our Service,
            except as follows:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Your computer may temporarily store copies of such materials in RAM incidental to your accessing and
              viewing those materials.
            </li>
            <li>
              You may store files that are automatically cached by your Web browser for display enhancement purposes.
            </li>
            <li>
              You may print or download one copy of a reasonable number of pages of the website for your own personal,
              non-commercial use and not for further reproduction, publication, or distribution.
            </li>
          </ul>
          <p>
            If we provide desktop, mobile, or other applications for download, you may download a single copy to your
            computer or mobile device solely for your own personal, non-commercial use, provided you agree to be bound
            by our end user license agreement for such applications.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Modify copies of any materials from this site.</li>
            <li>
              Use any illustrations, photographs, video or audio sequences, or any graphics separately from the
              accompanying text.
            </li>
            <li>
              Delete or alter any copyright, trademark, or other proprietary rights notices from copies of materials
              from this site.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">7. User Content</h2>
          <p>
            If the Service allows you to post, link, store, share, or otherwise make available certain information,
            text, graphics, videos, or other material ("User Content"), you are responsible for the User Content that
            you post on or through the Service, including its legality, reliability, and appropriateness.
          </p>
          <p>
            By posting User Content on or through the Service, you represent and warrant that: (i) the User Content is
            yours (you own it) or you have the right to use it and grant us the rights and license as provided in these
            Terms, and (ii) the posting of your User Content on or through the Service does not violate the privacy
            rights, publicity rights, copyrights, contract rights, or any other rights of any person.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">8. Disclaimers</h2>
          <p className="uppercase">
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER
            EXPRESS OR IMPLIED. NEITHER YAAKAI NOR ANY PERSON ASSOCIATED WITH YAAKAI MAKES ANY WARRANTY OR
            REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY
            OF THE SERVICE.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">9. Limitation of Liability</h2>
          <p className="uppercase">
            TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL YAAKAI, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE
            PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL
            THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICE.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">10. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Yaakai, its affiliates, licensors, and service providers,
            and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers,
            successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs,
            expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of
            these Terms or your use of the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">11. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or
            liability, under our sole discretion, for any reason whatsoever and without limitation, including but not
            limited to a breach of the Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">12. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms and your use of the Service shall be governed by and construed in accordance with the laws of
            India, including but not limited to the Information Technology Act, 2000, the Information Technology
            (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 ("SPDI
            Rules"), and the Trademarks Act, 1999.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">13. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material, we will provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">14. Contact Us</h2>
          <p>
            All feedback, comments, requests for technical support, and other communications relating to the Service
            should be directed to: yaakai1516@gmail.com.
          </p>

          <p className="mt-8 text-sm text-gray-500">
            Legal Disclaimer: These Terms and Conditions are provided for informational purposes only and do not
            constitute legal advice. Yaakai strongly recommends that you consult with a qualified legal professional in
            India to review these terms and ensure they meet your specific business needs and comply fully with all
            applicable laws and regulations before publishing them on your website.
          </p>
        </div>
      </div>
    </div>
  )
}
