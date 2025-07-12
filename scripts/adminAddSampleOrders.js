const admin = require('firebase-admin');
const path = require('path');

// Path to your service account key
const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

// Initialize Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const sampleOrders = [
  {
    quantity: 5,
    price: 35,
    totalAmount: 175,
    status: 'delivered',
    paymentStatus: 'completed',
    received: true,
    notes: 'Delivered on time',
    paymentMethod: 'Online',
    advancePaid: 175,
    balanceAmount: 0,
    dateOrdered: new Date('2024-01-15T10:30:00Z')
  },
  {
    quantity: 3,
    price: 35,
    totalAmount: 105,
    status: 'delivered',
    paymentStatus: 'completed',
    received: true,
    notes: 'Regular order',
    paymentMethod: 'Cash',
    advancePaid: 100,
    balanceAmount: 5,
    dateOrdered: new Date('2024-01-22T14:15:00Z')
  },
  {
    quantity: 8,
    price: 35,
    totalAmount: 280,
    status: 'ready',
    paymentStatus: 'partial',
    received: false,
    notes: 'Large order - ready for delivery',
    paymentMethod: 'Online',
    advancePaid: 200,
    balanceAmount: 80,
    dateOrdered: new Date('2024-02-01T09:45:00Z')
  },
  {
    quantity: 2,
    price: 35,
    totalAmount: 70,
    status: 'in_production',
    paymentStatus: 'pending',
    received: false,
    notes: 'Small order in production',
    paymentMethod: 'Cash',
    advancePaid: 0,
    balanceAmount: 70,
    dateOrdered: new Date('2024-02-05T16:20:00Z')
  },
  {
    quantity: 6,
    price: 35,
    totalAmount: 210,
    status: 'confirmed',
    paymentStatus: 'pending',
    received: false,
    notes: 'Confirmed order',
    paymentMethod: 'Online',
    advancePaid: 0,
    balanceAmount: 210,
    dateOrdered: new Date('2024-02-08T11:30:00Z')
  },
  {
    quantity: 4,
    price: 35,
    totalAmount: 140,
    status: 'pending',
    paymentStatus: 'pending',
    received: false,
    notes: 'New order just placed',
    paymentMethod: 'Cash',
    advancePaid: 0,
    balanceAmount: 140,
    dateOrdered: new Date('2024-02-10T13:45:00Z')
  }
];

async function addSampleOrders() {
  try {
    console.log('🔍 Looking for user "nishant"...');
    // Find the userId from usernameMappings
    const usernameMappingDoc = await db.collection('usernameMappings').doc('nishant').get();
    if (!usernameMappingDoc.exists) {
      console.log('❌ User "nishant" not found in usernameMappings');
      return;
    }
    const userId = usernameMappingDoc.data().userId;
    console.log(`✅ Found user "nishant" with ID: ${userId}`);

    // Get user document
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      console.log('❌ User document not found');
      return;
    }

    let totalOrdersAmount = 0;
    let totalAdvancePaid = 0;

    for (const orderData of sampleOrders) {
      const order = {
        userId,
        dateOrdered: admin.firestore.Timestamp.fromDate(orderData.dateOrdered),
        quantity: orderData.quantity,
        price: orderData.price,
        totalAmount: orderData.totalAmount,
        status: orderData.status,
        paymentStatus: orderData.paymentStatus,
        received: orderData.received,
        notes: orderData.notes,
        paymentMethod: orderData.paymentMethod,
        advancePaid: orderData.advancePaid,
        balanceAmount: orderData.balanceAmount,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      // Add to main orders collection
      const orderRef = await db.collection('orders').add(order);
      // Add to user's subcollection
      await db.collection('users').doc(userId).collection('orders').add({
        ...order,
        mainOrderId: orderRef.id
      });
      totalOrdersAmount += orderData.totalAmount;
      totalAdvancePaid += orderData.advancePaid;
      console.log(`✅ Added order: ${orderData.quantity} items - Rs.${orderData.totalAmount} (${orderData.status})`);
    }

    // Update user's financial info
    const currentUserData = userDoc.data();
    const newBalance = (currentUserData.balance || 0) + totalOrdersAmount;
    const newAdvancePaid = (currentUserData.advancePaid || 0) + totalAdvancePaid;
    await userDocRef.update({
      balance: newBalance,
      advancePaid: newAdvancePaid,
      oldOutstanding: currentUserData.oldOutstanding || 0
    });
    console.log('\n🎉 Sample orders added successfully!');
    console.log(`📊 Total orders amount: Rs.${totalOrdersAmount}`);
    console.log(`💰 Total advance paid: Rs.${totalAdvancePaid}`);
    console.log(`💳 Updated user balance: Rs.${newBalance}`);
    console.log('\n📱 You can now view these orders in the customer screen!');
    console.log('📅 Orders span across January and February - try switching months in the app!');
  } catch (error) {
    console.error('❌ Error adding sample orders:', error);
  }
}

addSampleOrders(); 