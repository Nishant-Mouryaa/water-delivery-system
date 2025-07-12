import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Order Status Types
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PRODUCTION = 'in_production',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// Payment Status Types
export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Order Interface
export interface Order {
  id?: string;
  userId: string;
  dateOrdered: Timestamp;
  quantity: number;
  price: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  received: boolean;
  notes?: string;
  deliveryDate?: Timestamp;
  paymentMethod?: string;
  advancePaid?: number;
  balanceAmount?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Order History Item Interface (for display)
export interface OrderHistoryItem {
  id: string;
  dateOrdered: string;
  received: boolean;
  quantity: number;
  price: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

// Order Service Class
export class OrderService {
  private static readonly COLLECTION_NAME = 'orders';
  private static readonly USER_ORDERS_SUBCOLLECTION = 'orders';

  // Create a new order
  static async createOrder(userId: string, orderData: Partial<Order>): Promise<string> {
    try {
      const order: Omit<Order, 'id'> = {
        userId,
        dateOrdered: serverTimestamp() as Timestamp,
        quantity: orderData.quantity || 1,
        price: orderData.price || 35, // Default price per item
        totalAmount: (orderData.quantity || 1) * (orderData.price || 35),
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        received: false,
        notes: orderData.notes || '',
        paymentMethod: orderData.paymentMethod || 'Online',
        advancePaid: orderData.advancePaid || 0,
        balanceAmount: ((orderData.quantity || 1) * (orderData.price || 35)) - (orderData.advancePaid || 0),
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        ...orderData
      };

      // Add to main orders collection
      const orderRef = await addDoc(collection(db, this.COLLECTION_NAME), order);
      
      // Also add to user's subcollection for easy access
      await addDoc(collection(db, 'users', userId, this.USER_ORDERS_SUBCOLLECTION), {
        ...order,
        mainOrderId: orderRef.id
      });

      return orderRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  // Get orders for a specific user
  static async getUserOrders(userId: string, status?: OrderStatus): Promise<Order[]> {
    try {
      let q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('dateOrdered', 'desc')
      );

      if (status) {
        q = query(q, where('status', '==', status));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw new Error('Failed to fetch user orders');
    }
  }

  // Get orders by month for a user
  static async getUserOrdersByMonth(userId: string, month: string, year: number): Promise<OrderHistoryItem[]> {
    try {
      const startDate = new Date(year, this.getMonthIndex(month), 1);
      const endDate = new Date(year, this.getMonthIndex(month) + 1, 0);

      console.log('🔍 Querying orders for:', { userId, month, year, startDate, endDate });

      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('dateOrdered', '>=', startDate),
        where('dateOrdered', '<=', endDate),
        orderBy('dateOrdered', 'desc')
      );

      const querySnapshot = await getDocs(q);
      console.log('📊 Found orders in main collection:', querySnapshot.docs.length);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📋 Order data:', { id: doc.id, ...data });
        return {
          id: doc.id,
          dateOrdered: data.dateOrdered.toDate().toLocaleDateString(),
          received: data.received || false,
          quantity: data.quantity || 0,
          price: data.totalAmount || 0, // Use totalAmount instead of price
          status: data.status || OrderStatus.PENDING,
          paymentStatus: data.paymentStatus || PaymentStatus.PENDING
        };
      });
    } catch (error) {
      console.error('Error fetching orders by month:', error);
      throw new Error('Failed to fetch orders by month');
    }
  }

  // Get available months for a user
  static async getAvailableMonths(userId: string): Promise<string[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('dateOrdered', 'desc')
      );

      const querySnapshot = await getDocs(q);
      console.log('📊 Total orders found for user:', querySnapshot.docs.length);
      
      const months = new Set<string>();
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const date = data.dateOrdered.toDate();
        const monthName = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        console.log('📅 Order date:', date, 'Month:', monthName, 'Year:', year);
        months.add(monthName);
      });

      const monthArray = Array.from(months);
      console.log('📋 Available months:', monthArray);
      return monthArray;
    } catch (error) {
      console.error('Error fetching available months:', error);
      throw new Error('Failed to fetch available months');
    }
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION_NAME, orderId), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  // Update payment status
  static async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, amount?: number): Promise<void> {
    try {
      const updateData: any = {
        paymentStatus,
        updatedAt: serverTimestamp()
      };

      if (amount !== undefined) {
        updateData.advancePaid = amount;
        updateData.balanceAmount = Math.max(0, updateData.totalAmount - amount);
      }

      await updateDoc(doc(db, this.COLLECTION_NAME, orderId), updateData);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }

  // Mark order as received
  static async markOrderAsReceived(orderId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION_NAME, orderId), {
        received: true,
        status: OrderStatus.DELIVERED,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking order as received:', error);
      throw new Error('Failed to mark order as received');
    }
  }

  // Get order by ID
  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orderDoc = await getDoc(doc(db, this.COLLECTION_NAME, orderId));
      if (orderDoc.exists()) {
        return {
          id: orderDoc.id,
          ...orderDoc.data()
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw new Error('Failed to fetch order');
    }
  }

  // Delete order
  static async deleteOrder(orderId: string, userId: string): Promise<void> {
    try {
      // Delete from main collection
      await deleteDoc(doc(db, this.COLLECTION_NAME, orderId));
      
      // Also delete from user's subcollection
      const userOrdersQuery = query(
        collection(db, 'users', userId, this.USER_ORDERS_SUBCOLLECTION),
        where('mainOrderId', '==', orderId)
      );
      const userOrdersSnapshot = await getDocs(userOrdersQuery);
      userOrdersSnapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new Error('Failed to delete order');
    }
  }

  // Get all orders (for admin)
  static async getAllOrders(status?: OrderStatus): Promise<Order[]> {
    try {
      let q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('dateOrdered', 'desc')
      );

      if (status) {
        q = query(q, where('status', '==', status));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw new Error('Failed to fetch all orders');
    }
  }

  // Helper method to get month index
  private static getMonthIndex(monthName: string): number {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    return months.indexOf(monthName.toLowerCase());
  }
} 