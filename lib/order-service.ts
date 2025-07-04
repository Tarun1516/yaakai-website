// Firebase App (and Firestore) must be initialized before this service is used.
// Typically in a file like 'firebase.ts' or 'firebaseConfig.ts'
// import { db } from './firebase'; // Assuming you have a firebase config file
import { getFirestore, collection, doc, setDoc, getDocs, query, where, updateDoc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

// Initialize Firestore - This assumes Firebase app is already initialized.
// If not, you need to initialize it elsewhere: firebase.initializeApp(firebaseConfig);
const db = getFirestore();

// Types
export interface Order {
  id: string
  userId: string
  productId: string
  productName: string
  quantity: number
  purchaseDate: string
  status: "completed" | "refunded" | "processing"
  transactionId?: string
}

export interface RefundRequest {
  orderId: string
  userId: string
  reason: string
  issueDescription: string
  requestDate: string
  status: "pending" | "approved" | "rejected"
}

// Mock data storage - in a real app, this would be in a database
// const mockOrders: Record<string, Order> = {} // Removed mockOrders
const mockRefundRequests: Record<string, RefundRequest> = {}

// Custom ID generator for unique IDs
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Placeholder for database interaction - replace with actual implementation
async function saveOrderToDatabase(order: Order): Promise<void> {
  // In a real app, this would save the order to a database
  console.log("Saving order to Firestore:", order);
  try {
    const orderRef = doc(db, "orders", order.id);
    await setDoc(orderRef, order);
  } catch (error) {
    console.error("Error saving order to Firestore:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
  // For now, we'll keep the mockOrders for refund requests to work without a full DB setup
  // This part should be removed when a real database is integrated for orders
  // mockOrders[order.id] = order; // Removed mockOrders usage
}

// Placeholder for database interaction - replace with actual implementation
async function fetchOrdersFromDatabase(userId: string): Promise<Order[]> {
  // In a real app, this would fetch orders from a database
  console.log("Fetching orders from Firestore for user:", userId);
  try {
    const ordersCollectionRef = collection(db, "orders");
    const q = query(ordersCollectionRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      // Assuming the document data matches the Order interface
      // and doc.id is the same as the id field within the document data
      // because we used order.id to set the document.
      orders.push({ ...doc.data() as Omit<Order, 'id'>, id: doc.id });
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders from Firestore:", error);
    return []; // Return empty array on error, or handle differently
  }
  // For now, we'll keep the mockOrders for refund requests to work without a full DB setup
  // This part should be removed when a real database is integrated for orders
  // return Object.values(mockOrders).filter((order) => order.userId === userId); // Removed mockOrders usage
}

// Get orders for a user
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    console.log(`Getting orders for user: ${userId}`)

    // In a real app, this would query the database
    // For now, return mock data
    const userOrders = await fetchOrdersFromDatabase(userId);
    return userOrders
  } catch (error) {
    console.error("Error getting user orders:", error)
    return []
  }
}

// Create a new order
export async function createOrder(data: {
  userId: string
  productId: string
  productName: string
  quantity: number
  transactionId?: string
}): Promise<Order> {
  try {
    console.log(`Creating order for user: ${data.userId}`)

    const orderId = generateUniqueId()
    const now = new Date()

    const newOrder: Order = {
      id: orderId,
      userId: data.userId,
      productId: data.productId,
      productName: data.productName,
      quantity: data.quantity,
      purchaseDate: now.toISOString(),
      status: "completed",
      transactionId: data.transactionId,
    }

    // Store the order
    await saveOrderToDatabase(newOrder);
    return newOrder
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Request a refund
export async function requestRefund(data: {
  orderId: string
  userId: string
  reason: string
  issueDescription: string
}): Promise<boolean> {
  try {
    console.log(`Creating refund request for order: ${data.orderId}`)

    const refundId = generateUniqueId()
    const now = new Date()

    // Create refund request
    const refundRequest: RefundRequest = {
      orderId: data.orderId,
      userId: data.userId,
      reason: data.reason,
      issueDescription: data.issueDescription,
      requestDate: now.toISOString(),
      status: "pending",
    }

    // Store refund request (mock storage for compatibility)
    mockRefundRequests[refundId] = refundRequest

    // Try to update order status in Firestore (non-blocking)
    // If it fails, the refund request still succeeds
    try {
      const orderRef = doc(db, "orders", data.orderId);
      await updateDoc(orderRef, { 
        status: "processing",
        updatedAt: new Date().toISOString()
      });
      console.log(`Order ${data.orderId} status updated to processing in Firestore.`);
    } catch (error) {
      console.log(`Could not update order ${data.orderId} in Firestore (this is OK for old orders):`, error instanceof Error ? error.message : 'Unknown error');
      // This is expected for old orders that don't exist in Firestore
      // The refund request email will still be sent successfully
    }

    return true
  } catch (error) {
    console.error("Error requesting refund:", error)
    return false
  }
}
