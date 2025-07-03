/**
 * Utility functions to help debug Firebase authentication issues
 */

/**
 * Gets the current domain that needs to be added to Firebase
 * @returns {string} The current domain
 */
export function getCurrentDomain(): string {
  return window.location.hostname
}

/**
 * Checks if the current domain is likely a development domain
 * @returns {boolean} True if the domain is likely a development domain
 */
export function isDevDomain(): boolean {
  const domain = getCurrentDomain()
  return (
    domain === "localhost" || domain.includes(".local") || domain.includes("127.0.0.1") || domain.includes("192.168.")
  )
}

/**
 * Gets instructions for adding the current domain to Firebase
 * @returns {string} Instructions for adding the domain
 */
export function getFirebaseAuthInstructions(): string {
  const domain = getCurrentDomain()

  return `
To add "${domain}" to your Firebase authorized domains:

1. Go to the Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Go to Authentication > Settings
4. Scroll down to "Authorized domains"
5. Click "Add domain"
6. Enter "${domain}" (without http:// or https://)
7. Click "Add"

Note: If you're using a development domain like localhost, you may need to use a different authentication method for development.
  `
}
