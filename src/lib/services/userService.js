// lib/services/userService.js
import { db } from "@/lib/firebase/client";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit
} from "firebase/firestore";

const USERS_COLLECTION = "users";
const SUBSCRIBERS_COLLECTION = "subscribers";
const ITEMS_PER_PAGE = 10;

// ============ GET ALL USERS ============
export const getUsers = async (page = 1, searchTerm = "", statusFilter = "all", subscriptionFilter = "all") => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, orderBy("createdAt", "desc"), limit(100));
    const snapshot = await getDocs(q);

    // Get subscribed emails from subscribers collection
    const subscribersRef = collection(db, SUBSCRIBERS_COLLECTION);
    const subQuery = query(subscribersRef, where("status", "==", "active"));
    const subSnapshot = await getDocs(subQuery);
    
    const subscribedEmails = new Set();
    subSnapshot.forEach(doc => {
      const email = doc.data().email?.toLowerCase();
      if (email) subscribedEmails.add(email);
    });

    let users = [];
    for (const document of snapshot.docs) {
      const data = document.data();
      const userEmail = data.email?.toLowerCase();
      
      const isSubscribed = data.isSubscribed === true || subscribedEmails.has(userEmail);

      users.push({
        id: document.id,
        uid: data.uid || document.id,
        name: data.name || data.displayName || "User",
        email: data.email || "",
        avatar: data.avatar || data.photoURL || null,
        role: data.role || "user",
        status: data.status || "active",
        isSubscribed: isSubscribed,
        createdAt: data.createdAt?.toDate?.() || null,
        lastLoginAt: data.lastLoginAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
      });
    }

    // Apply filters
    if (statusFilter !== "all") {
      users = users.filter(user => user.status === statusFilter);
    }
    if (subscriptionFilter !== "all") {
      users = users.filter(user => 
        subscriptionFilter === "subscribed" ? user.isSubscribed : !user.isSubscribed
      );
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      users = users.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }

    // Pagination
    const totalItems = users.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      success: true,
      users: paginatedUsers,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error getting users:", error);
    return { success: false, error: error.message, users: [], totalPages: 1, totalItems: 0 };
  }
};

// ============ GET USER BY ID ============
export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: "User not found" };
    }

    const data = userSnap.data();
    return {
      success: true,
      user: {
        id: userSnap.id,
        uid: data.uid || userSnap.id,
        name: data.name || "User",
        email: data.email || "",
        avatar: data.avatar || data.photoURL || null,
        role: data.role || "user",
        status: data.status || "active",
        isSubscribed: data.isSubscribed || false,
        createdAt: data.createdAt?.toDate?.() || null,
        lastLoginAt: data.lastLoginAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============ UPDATE USER STATUS (BLOCK/UNBLOCK) ============
export const updateUserStatus = async (userId, status) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      status: status,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============ UPDATE USER SUBSCRIPTION ============
export const updateUserSubscription = async (userId, isSubscribed) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const user = await getUserById(userId);

    if (!user.success) {
      return { success: false, error: "User not found" };
    }

    // Update user document
    await updateDoc(userRef, {
      isSubscribed: isSubscribed,
      updatedAt: serverTimestamp(),
    });

    // Sync with subscribers collection
    const subscribersRef = collection(db, SUBSCRIBERS_COLLECTION);
    const q = query(subscribersRef, where("email", "==", user.user.email?.toLowerCase()));
    const snapshot = await getDocs(q);

    if (isSubscribed) {
      if (!snapshot.empty) {
        const subDoc = snapshot.docs[0];
        await updateDoc(doc(db, SUBSCRIBERS_COLLECTION, subDoc.id), {
          status: "active",
          userId: userId,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, SUBSCRIBERS_COLLECTION, user.user.email?.toLowerCase()), {
          email: user.user.email?.toLowerCase(),
          name: user.user.name || "",
          userId: userId,
          status: "active",
          source: "admin_manual",
          subscribedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } else {
      if (!snapshot.empty) {
        const subDoc = snapshot.docs[0];
        await updateDoc(doc(db, SUBSCRIBERS_COLLECTION, subDoc.id), {
          status: "inactive",
          unsubscribedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============ DELETE USER ============
export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      // Clean up subscribers collection
      if (userData.email) {
        const subscribersRef = collection(db, SUBSCRIBERS_COLLECTION);
        const q = query(subscribersRef, where("email", "==", userData.email.toLowerCase()));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const subDoc = snapshot.docs[0];
          await updateDoc(doc(db, SUBSCRIBERS_COLLECTION, subDoc.id), {
            status: "inactive",
            userId: null,
            updatedAt: serverTimestamp(),
          });
        }
      }
    }

    await deleteDoc(userRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============ EXPORT SUBSCRIBED USERS TO CSV ============
export const exportSubscribedUsersToCSV = async () => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const usersSnapshot = await getDocs(usersRef);

    const subscribersRef = collection(db, SUBSCRIBERS_COLLECTION);
    const subQuery = query(subscribersRef, where("status", "==", "active"));
    const subSnapshot = await getDocs(subQuery);

    const subscribedEmails = new Map();

    subSnapshot.forEach(doc => {
      const data = doc.data();
      const email = data.email?.toLowerCase();
      if (email) {
        subscribedEmails.set(email, {
          email: data.email,
          name: data.name || "",
          subscribedAt: data.subscribedAt?.toDate?.() || null,
        });
      }
    });

    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.isSubscribed === true && data.email) {
        const email = data.email.toLowerCase();
        if (!subscribedEmails.has(email)) {
          subscribedEmails.set(email, {
            email: data.email,
            name: data.name || "",
            subscribedAt: data.createdAt?.toDate?.() || null,
          });
        }
      }
    });

    const csvRows = [["Email", "Name", "Subscribed Date"]];
    subscribedEmails.forEach(subscriber => {
      csvRows.push([
        subscriber.email,
        subscriber.name,
        subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString() : ""
      ]);
    });

    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    return { success: true, csv: csvContent, count: subscribedEmails.size };
  } catch (error) {
    return { success: false, csv: "", count: 0 };
  }
};

// ============ GET USER STATS ============
export const getUserStats = async () => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);

    const subscribersRef = collection(db, SUBSCRIBERS_COLLECTION);
    const subQuery = query(subscribersRef, where("status", "==", "active"));
    const subSnapshot = await getDocs(subQuery);

    let totalUsers = 0, activeUsers = 0, blockedUsers = 0, subscribedUsers = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      totalUsers++;
      if (data.status === "active") activeUsers++;
      if (data.status === "blocked") blockedUsers++;
      if (data.isSubscribed === true) subscribedUsers++;
    });

    // Use the higher count between users and subscribers collection
    const subscriberCount = Math.max(subscribedUsers, subSnapshot.size);

    return {
      success: true,
      stats: { totalUsers, activeUsers, blockedUsers, subscribedUsers: subscriberCount }
    };
  } catch (error) {
    return { success: false, stats: null };
  }
};