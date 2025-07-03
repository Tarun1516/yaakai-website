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

// Create user with email and password
export async function createUserWithEmail(email: string, password: string, displayName: string): Promise<void> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // Update profile with display name
    await updateProfile(userCredential.user, { displayName })
    console.log("User created successfully:", userCredential.user.uid)
  } catch (error: any) {
    console.error("Error creating user:", error)
    throw error
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    console.log("User signed in successfully")
  } catch (error: any) {
    console.error("Error signing in:", error)
    throw error
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

// Export auth and db for direct use if needed
export { auth, db }
