// Firebase Authentication Service
import { initializeApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
  type User,
} from "firebase/auth"

// Import Firestore
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCv8z2NYSnJitIB4slPJ3NIkud3LApIeQI",
  authDomain: "yaakai---backend.firebaseapp.com",
  projectId: "yaakai---backend",
  storageBucket: "yaakai---backend.firebasestorage.app",
  messagingSenderId: "359167637257",
  appId: "1:359167637257:web:bae69125e4a5bfdf6105d8",
  measurementId: "G-G76NSRXEDW",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Verify that Google Auth is properly initialized
const googleProvider = new GoogleAuthProvider()
// Add any additional scopes if needed
// googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// Google provider
googleProvider.setCustomParameters({ prompt: "select_account" })

// GitHub provider
const githubProvider = new GithubAuthProvider()

// Check if user exists (for debugging purposes)
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    // Try to fetch sign-in methods for the email
    const signInMethods = await fetchSignInMethodsForEmail(auth, email)
    console.log("Sign-in methods for", email, ":", signInMethods)
    return signInMethods.length > 0
  } catch (error: any) {
    console.error("Error checking user existence:", error)
    // If we can't check, assume user might exist and let the actual sign-in attempt handle it
    return true
  }
}

// Alternative method to check if user exists by attempting password reset
export async function checkUserExistsByPasswordReset(email: string): Promise<boolean> {
  try {
    await firebaseSendPasswordResetEmail(auth, email)
    console.log("Password reset email sent successfully - user exists")
    return true
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.log("User not found via password reset check")
      return false
    }
    console.warn("Could not check user via password reset:", error)
    return true // Assume user exists if we can't check
  }
}

// Create user with email and password
export async function createUserWithEmail(email: string, password: string, displayName: string): Promise<void> {
  try {
    console.log("🔄 Creating user with email:", email)
    console.log("Display name:", displayName)
    console.log("Password length:", password.length)
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log("✅ User created in Firebase Auth:", userCredential.user.uid)
    
    // Update profile with display name
    await updateProfile(userCredential.user, { displayName })
    console.log("✅ Profile updated with display name:", displayName)
    
    // Verify the user exists by checking sign-in methods
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email)
      console.log("✅ Verification - Sign-in methods available:", signInMethods)
    } catch (verifyError) {
      console.warn("⚠️ Could not verify user creation:", verifyError)
    }
    
    console.log("✅ User creation completed successfully!")
  } catch (error: any) {
    console.error("❌ Error creating user:", error)
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)
    throw error
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<void> {
  try {
    // Directly attempt sign-in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("User signed in successfully:", userCredential.user.email)
    
  } catch (error: any) {
    console.error("Firebase authentication error:", error.code, error.message)
    
    // Handle Firebase authentication errors with user-friendly messages
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        throw new Error('Invalid email or password. Please check your credentials and try again.')
      
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.')
      
      case 'auth/user-disabled':
        throw new Error('This account has been disabled. Please contact support.')
      
      case 'auth/too-many-requests':
        throw new Error('Too many failed login attempts. Please try again later or reset your password.')
      
      case 'auth/network-request-failed':
        throw new Error('Network error. Please check your internet connection and try again.')
      
      default:
        throw new Error('Login failed. Please try again.')
    }
  }
}

// Debug sign in with better error checking
export async function debugSignInWithEmail(email: string, password: string): Promise<void> {
  try {
    console.log("=== Debug Sign In Started ===")
    console.log("Email:", email)
    console.log("Password length:", password.length)
    
    // Attempt sign in directly without checking user existence first
    console.log("Attempting to sign in...")
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("User signed in successfully:", userCredential.user.uid)
    console.log("User email:", userCredential.user.email)
    console.log("=== Debug Sign In Completed ===")
  } catch (error: any) {
    console.error("=== Debug Sign In Error ===")
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)
    console.error("Full error:", error)
    
    // Provide more specific error messages based on Firebase error codes
    if (error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password. Please check your credentials and try again.')
    } else if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email address. Please sign up first.')
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.')
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed login attempts. Please try again later or reset your password.')
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('This account has been disabled. Please contact support.')
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address format.')
    } else {
      throw new Error(error.message || 'Failed to sign in. Please try again.')
    }
  }
}

// Sign in with Google
export async function signInWithGoogle(): Promise<void> {
  try {
    // Log the current window location to help debug domain issues
    console.log("Current domain:", window.location.hostname)

    // Attempt to sign in with Google
    await signInWithPopup(auth, googleProvider)
    console.log("User signed in with Google successfully")
  } catch (error: any) {
    console.error("Error signing in with Google:", error)

    // For unauthorized domain error, provide a more detailed error message
    if (error.code === "auth/unauthorized-domain") {
      const currentDomain = window.location.hostname
      throw new Error(
        `Domain "${currentDomain}" is not authorized for Google sign-in. Please add this exact domain to your Firebase authorized domains list in the Firebase Console under Authentication > Settings > Authorized domains.`,
      )
    }

    throw error
  }
}

// Sign in with GitHub
export async function signInWithGitHub(): Promise<void> {
  try {
    await signInWithPopup(auth, githubProvider)
    console.log("User signed in with GitHub successfully")
  } catch (error: any) {
    console.error("Error signing in with GitHub:", error)

    // For unauthorized domain error, provide a helpful error message
    if (error.code === "auth/unauthorized-domain") {
      throw new Error(
        "This domain is not authorized for GitHub sign-in. Please add this domain to your Firebase authorized domains list.",
      )
    }

    throw error
  }
}

// Update user profile
export async function updateUserProfile(displayName: string, email?: string, phoneNumber?: string): Promise<void> {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("No user is currently signed in")
    }

    // Update display name
    await updateProfile(user, { displayName })
    console.log("User profile updated successfully")
  } catch (error: any) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Delete user account
export async function deleteUserAccount(): Promise<void> {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("No user is currently signed in")
    }

    await deleteUser(user)
    console.log("User account deleted successfully")
  } catch (error: any) {
    console.error("Error deleting user account:", error)
    throw error
  }
}

// Sign out
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth)
    console.log("User signed out successfully")
  } catch (error: any) {
    console.error("Error signing out:", error)
    throw error
  }
}

// Check if email exists
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email)
    return methods.length > 0
  } catch (error: any) {
    console.error("Error checking if email exists:", error)
    return false
  }
}

// Get current user
export function getCurrentUser(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

// Send password reset email
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    await firebaseSendPasswordResetEmail(auth, email)
    console.log("Password reset email sent successfully")
  } catch (error: any) {
    console.error("Error sending password reset email:", error)
    throw error
  }
}

// Verify password reset code
export async function verifyPasswordResetCode(code: string): Promise<boolean> {
  try {
    await firebaseVerifyPasswordResetCode(auth, code)
    return true
  } catch (error: any) {
    console.error("Error verifying password reset code:", error)
    return false
  }
}

// Confirm password reset
export async function confirmPasswordReset(code: string, newPassword: string): Promise<void> {
  try {
    await firebaseConfirmPasswordReset(auth, code, newPassword)
    console.log("Password reset confirmed successfully")
  } catch (error: any) {
    console.error("Error confirming password reset:", error)
    throw error
  }
}

// Payment and Order Management Functions

export interface PaymentRecord {
  id: string
  paymentId: string
  userId: string
  userEmail: string
  userName: string
  amount: number
  currency: string
  productType: string
  applicationName: string
  paymentTime: string
  createdAt: Timestamp
  status: 'completed' | 'pending' | 'failed'
}

// Save payment data to Firestore
export async function savePaymentRecord(paymentData: Omit<PaymentRecord, 'id' | 'createdAt'>): Promise<string> {
  try {
    console.log("💾 Saving payment record to Firebase:", paymentData)
    
    // Check if user is authenticated
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("User must be authenticated to save payment records")
    }
    
    const docRef = await addDoc(collection(db, 'payments'), {
      ...paymentData,
      createdAt: serverTimestamp(),
    })
    
    console.log("✅ Payment record saved with ID:", docRef.id)
    return docRef.id
  } catch (error: any) {
    console.error("❌ Error saving payment record:", error)
    
    if (error.code === 'permission-denied') {
      console.error("🔒 Firebase permission denied. Please check Firestore security rules.")
      throw new Error("Permission denied: Unable to save payment record. Please contact support.")
    }
    
    throw error
  }
}

// Get all payment records for a specific user
export async function getUserPayments(userId: string): Promise<PaymentRecord[]> {
  try {
    console.log("📋 Fetching payment records for user:", userId)
    
    // Check if user is authenticated
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.log("⚠️ User not authenticated, returning empty array")
      return []
    }
    
    // Simple query without orderBy to avoid index requirement initially
    const q = query(
      collection(db, 'payments'),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    const payments: PaymentRecord[] = []
    
    querySnapshot.forEach((doc) => {
      payments.push({
        id: doc.id,
        ...doc.data(),
      } as PaymentRecord)
    })
    
    // Sort manually by createdAt (client-side) to avoid index requirement
    payments.sort((a, b) => {
      const aTime = a.createdAt ? (a.createdAt as any).toDate() : new Date(a.paymentTime)
      const bTime = b.createdAt ? (b.createdAt as any).toDate() : new Date(b.paymentTime)
      return bTime.getTime() - aTime.getTime() // Descending order (newest first)
    })
    
    console.log("✅ Found", payments.length, "payment records for user")
    return payments
  } catch (error: any) {
    console.error("❌ Error fetching user payments:", error)
    
    if (error.code === 'permission-denied') {
      console.error("🔒 Firebase permission denied. Please check Firestore security rules.")
      return [] // Return empty array instead of throwing error
    }
    
    if (error.code === 'failed-precondition' && error.message.includes('index')) {
      console.error("🔍 Firebase index required. Creating simple query without ordering...")
      
      // Fallback: Try simple query without ordering
      try {
        const simpleQ = query(
          collection(db, 'payments'),
          where('userId', '==', userId)
        )
        const simpleSnapshot = await getDocs(simpleQ)
        const simplePayments: PaymentRecord[] = []
        
        simpleSnapshot.forEach((doc) => {
          simplePayments.push({
            id: doc.id,
            ...doc.data(),
          } as PaymentRecord)
        })
        
        console.log("✅ Fallback query successful:", simplePayments.length, "records")
        return simplePayments
      } catch (fallbackError) {
        console.error("❌ Fallback query also failed:", fallbackError)
        return []
      }
    }
    
    // For other errors, return empty array to prevent app crash
    console.error("⚠️ Returning empty payment array due to error")
    return []
  }
}

// Get a specific payment record
export async function getPaymentRecord(paymentId: string): Promise<PaymentRecord | null> {
  try {
    console.log("🔍 Fetching payment record:", paymentId)
    
    const q = query(
      collection(db, 'payments'),
      where('paymentId', '==', paymentId)
    )
    
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      console.log("❌ Payment record not found")
      return null
    }
    
    const doc = querySnapshot.docs[0]
    const paymentRecord = {
      id: doc.id,
      ...doc.data(),
    } as PaymentRecord
    
    console.log("✅ Payment record found:", paymentRecord)
    return paymentRecord
  } catch (error: any) {
    console.error("❌ Error fetching payment record:", error)
    throw error
  }
}

// Comprehensive debug function for login issues
export async function debugLoginIssue(email: string, password: string): Promise<void> {
  console.log("🔍 === COMPREHENSIVE LOGIN DEBUG ===")
  
  // Step 1: Check current auth state
  getCurrentAuthState()
  
  // Step 2: Test if user exists using fetchSignInMethodsForEmail
  console.log("\n📧 Testing user existence with fetchSignInMethodsForEmail...")
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email)
    console.log("Sign-in methods:", signInMethods)
    if (signInMethods.length > 0) {
      console.log("✅ User exists with methods:", signInMethods)
    } else {
      console.log("❌ No sign-in methods found for this email")
    }
  } catch (error: any) {
    console.error("❌ Error checking sign-in methods:", error)
  }
  
  // Step 3: Test if user exists using duplicate creation attempt
  console.log("\n🔄 Testing user existence with duplicate creation...")
  try {
    const userExists = await testUserExists(email)
    console.log("User exists (via duplicate test):", userExists)
  } catch (error: any) {
    console.error("❌ Error in duplicate test:", error)
  }
  
  // Step 4: Attempt actual sign-in
  console.log("\n🔐 Attempting actual sign-in...")
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("✅ Sign-in successful!")
    console.log("User ID:", userCredential.user.uid)
    console.log("User email:", userCredential.user.email)
  } catch (error: any) {
    console.error("❌ Sign-in failed:")
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)
    console.error("Full error:", error)
  }
  
  console.log("🔍 === DEBUG COMPLETE ===")
}

// Test if user exists by attempting to create duplicate account
export async function testUserExists(email: string): Promise<boolean> {
  try {
    console.log("Testing if user exists by attempting duplicate creation...")
    // Try to create a user with the same email and a dummy password
    await createUserWithEmailAndPassword(auth, email, "temppassword123!")
    // If this succeeds, the user didn't exist before
    console.log("User did not exist - new user created (this shouldn't happen in test)")
    // Clean up by deleting the test user
    if (auth.currentUser) {
      await deleteUser(auth.currentUser)
    }
    return false
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("User exists - email already in use")
      return true
    } else {
      console.error("Error testing user existence:", error)
      return false
    }
  }
}

// Debug function to check current Firebase configuration and state
export function debugFirebaseState(): void {
  console.log("🔧 === FIREBASE DEBUG INFO ===")
  console.log("Firebase app:", auth.app)
  console.log("Auth instance:", auth)
  console.log("Current user:", auth.currentUser)
  console.log("Firebase config:", {
    apiKey: auth.app.options.apiKey,
    authDomain: auth.app.options.authDomain,
    projectId: auth.app.options.projectId
  })
  console.log("=== END DEBUG INFO ===")
}

// Quick test function to verify registration and login work
export async function testRegistrationAndLogin(): Promise<void> {
  const testEmail = `test${Date.now()}@test.com`
  const testPassword = "TestPass123!"
  const testName = "Test User"
  
  console.log("🧪 === TESTING REGISTRATION AND LOGIN ===")
  
  try {
    // Step 1: Create user
    console.log("📝 Step 1: Creating user...")
    await createUserWithEmail(testEmail, testPassword, testName)
    console.log("✅ User created successfully")
    
    // Wait a moment for Firebase to process
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Step 2: Try to sign in
    console.log("🔐 Step 2: Attempting to sign in...")
    await signInWithEmailAndPassword(auth, testEmail, testPassword)
    console.log("✅ Sign-in successful!")
    
    // Step 3: Sign out
    console.log("🚪 Step 3: Signing out...")
    await firebaseSignOut(auth)
    console.log("✅ Signed out successfully")
    
    console.log("🎉 ALL TESTS PASSED!")
    console.log("Credentials that worked:")
    console.log("Email:", testEmail)
    console.log("Password:", testPassword)
    console.log("🔧 If this test passes but your manual login fails, the issue is with the user input or existing account setup.")
    
  } catch (error) {
    console.error("❌ TEST FAILED:", error)
    throw error
  }
}

// Test function to create a simple test user
export async function createTestUser(): Promise<{ email: string; password: string }> {
  const testEmail = `test${Date.now()}@example.com`
  const testPassword = "TestPassword123!"
  const testName = "Test User"
  
  try {
    console.log("🧪 Creating test user...")
    await createUserWithEmail(testEmail, testPassword, testName)
    console.log("✅ Test user created successfully!")
    console.log("Email:", testEmail)
    console.log("Password:", testPassword)
    
    return { email: testEmail, password: testPassword }
  } catch (error) {
    console.error("❌ Failed to create test user:", error)
    throw error
  }
}

// Simple test function to verify Firebase authentication is working
export async function testFirebaseLogin(email: string, password: string): Promise<void> {
  console.log("=== Testing Firebase Login ===")
  console.log("Email:", email)
  console.log("Password length:", password.length)
  
  try {
    console.log("Calling signInWithEmailAndPassword directly...")
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("✅ Login successful!")
    console.log("User ID:", userCredential.user.uid)
    console.log("User email:", userCredential.user.email)
    console.log("Email verified:", userCredential.user.emailVerified)
    console.log("=== Test Complete ===")
  } catch (error: any) {
    console.error("❌ Login failed!")
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)
    console.error("=== Test Failed ===")
    throw error
  }
}

// Simple test function to verify current user state
export function getCurrentAuthState(): void {
  console.log("=== Current Auth State ===")
  console.log("Current user:", auth.currentUser)
  console.log("Auth state:", auth.currentUser ? "Signed in" : "Signed out")
  if (auth.currentUser) {
    console.log("User ID:", auth.currentUser.uid)
    console.log("User email:", auth.currentUser.email)
    console.log("User display name:", auth.currentUser.displayName)
    console.log("User providers:", auth.currentUser.providerData)
  }
  console.log("=== End Auth State ===")
}

// Simple diagnostic function to understand the login issue
export async function diagnoseLoginIssue(email: string): Promise<void> {
  console.log("🔍 === DIAGNOSING LOGIN ISSUE ===")
  console.log("Email to check:", email)
  
  // Method 1: Check sign-in methods
  console.log("\n📧 Checking sign-in methods...")
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email)
    console.log("✅ Sign-in methods found:", signInMethods)
    
    if (signInMethods.length === 0) {
      console.log("❌ No sign-in methods found - user does not exist")
      console.log("🔧 Solution: Register this email first")
      return
    }
    
    if (signInMethods.includes('password')) {
      console.log("✅ Email/password sign-in is available")
    } else {
      console.log("❌ Email/password sign-in is NOT available")
      console.log("Available methods:", signInMethods)
      if (signInMethods.includes('google.com')) {
        console.log("🔧 This account uses Google sign-in")
      }
      if (signInMethods.includes('github.com')) {
        console.log("🔧 This account uses GitHub sign-in")
      }
    }
  } catch (error: any) {
    console.error("❌ Error checking sign-in methods:", error)
  }
  
  // Method 2: Check via password reset
  console.log("\n🔑 Checking via password reset...")
  try {
    const userExists = await checkUserExistsByPasswordReset(email)
    if (userExists) {
      console.log("✅ User exists (confirmed via password reset)")
    } else {
      console.log("❌ User does not exist (confirmed via password reset)")
    }
  } catch (error: any) {
    console.error("❌ Error checking via password reset:", error)
  }
  
  console.log("\n🔍 === DIAGNOSIS COMPLETE ===")
}

// Change user password
export async function changeUserPassword(currentPassword: string, newPassword: string): Promise<void> {
  try {
    const user = auth.currentUser
    if (!user || !user.email) {
      throw new Error("No user is currently signed in")
    }

    console.log("Changing password for user:", user.email)

    // Create credential for reauthentication
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    
    // Reauthenticate user with current password
    await reauthenticateWithCredential(user, credential)
    console.log("User reauthenticated successfully")

    // Update password
    await updatePassword(user, newPassword)
    console.log("Password updated successfully")

  } catch (error: any) {
    console.error("Error changing password:", error)
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)

    // Handle specific Firebase errors
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        throw new Error('Current password is incorrect. Please try again.')
      
      case 'auth/weak-password':
        throw new Error('New password is too weak. Please choose a stronger password.')
      
      case 'auth/requires-recent-login':
        throw new Error('For security reasons, please log out and log in again before changing your password.')
      
      case 'auth/too-many-requests':
        throw new Error('Too many password change attempts. Please try again later.')
      
      default:
        throw new Error(error.message || 'Failed to change password. Please try again.')
    }
  }
}

// Export auth and db for direct use if needed
export { auth, db }
