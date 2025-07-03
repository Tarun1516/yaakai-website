// List of valid email domains
const validEmailDomains = [
  // Gmail
  "gmail.com",
  // General Extensions
  ".com",
  ".org",
  ".net",
  ".edu",
  ".gov",
  ".io",
  ".co",
  ".me",
  ".info",
  ".biz",
  // Outlook/Hotmail
  "outlook.com",
  "hotmail.com",
  "outlook.co.uk",
  "outlook.nl",
  "outlook.fr",
  "outlook.de",
  "hotmail.co.uk",
  "hotmail.fr",
  "hotmail.de",
  // Yahoo
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.fr",
  "yahoo.de",
  "yahoo.es",
  "yahoo.it",
  // Apple Mail
  "icloud.com",
  "me.com",
  "mac.com",
  // Professional Email Providers
  "protonmail.com",
  "pm.me",
  "fastmail.com",
  "fastmail.fm",
  "zoho.com",
]

export function isValidEmailDomain(email: string): boolean {
  if (!email || !email.includes("@")) return false

  const domain = email.split("@")[1].toLowerCase()

  // Check if the domain is in our list of valid domains
  return validEmailDomains.some((validDomain) => {
    // For general extensions like .com, .org, etc.
    if (validDomain.startsWith(".")) {
      return domain.endsWith(validDomain)
    }
    // For specific domains like gmail.com, outlook.com, etc.
    return domain === validDomain
  })
}
