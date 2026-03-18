import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Create a wish (birthday or anniversary)
export const createWish = async (wishData) => {
  try {
    const wishesRef = collection(db, 'wishes');
    const docRef = await addDoc(wishesRef, {
      ...wishData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'active',
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating wish:', error);
    throw error;
  }
};

// Update a wish
export const updateWish = async (wishId, wishData) => {
  try {
    const wishRef = doc(db, 'wishes', wishId);
    await updateDoc(wishRef, {
      ...wishData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating wish:', error);
    throw error;
  }
};

// Delete a wish
export const deleteWish = async (wishId) => {
  try {
    const wishRef = doc(db, 'wishes', wishId);
    await deleteDoc(wishRef);
  } catch (error) {
    console.error('Error deleting wish:', error);
    throw error;
  }
};

// Get wish by ID
export const getWishById = async (wishId) => {
  try {
    const wishRef = doc(db, 'wishes', wishId);
    const snapshot = await getDoc(wishRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting wish:', error);
    throw error;
  }
};

// Get wish by slug (for public pages)
export const getWishBySlug = async (slug) => {
  try {
    const wishesRef = collection(db, 'wishes');
    const q = query(
      wishesRef,
      where('slug', '==', slug),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting wish by slug:', error);
    throw error;
  }
};

// Get all wishes (paginated)
export const getAllWishes = async (pageSize = 20, lastDoc = null) => {
  try {
    const wishesRef = collection(db, 'wishes');
    let q = query(
      wishesRef,
      orderBy('createdAt', 'desc'),
      limit(pageSize + 1)
    );

    if (lastDoc) {
      q = query(
        wishesRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize + 1)
      );
    }

    const snapshot = await getDocs(q);
    const wishes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const hasMore = wishes.length > pageSize;
    if (hasMore) {
      wishes.pop();
    }

    return { wishes, hasMore };
  } catch (error) {
    console.error('Error getting wishes:', error);
    throw error;
  }
};

// Get wishes by type (birthday or anniversary)
export const getWishesByType = async (type, pageSize = 20, lastDoc = null) => {
  try {
    const wishesRef = collection(db, 'wishes');
    let q = query(
      wishesRef,
      where('type', '==', type),
      orderBy('createdAt', 'desc'),
      limit(pageSize + 1)
    );

    if (lastDoc) {
      q = query(
        wishesRef,
        where('type', '==', type),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize + 1)
      );
    }

    const snapshot = await getDocs(q);
    const wishes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const hasMore = wishes.length > pageSize;
    if (hasMore) {
      wishes.pop();
    }

    return { wishes, hasMore };
  } catch (error) {
    console.error('Error getting wishes by type:', error);
    throw error;
  }
};

// Toggle wish status (active/inactive)
export const toggleWishStatus = async (wishId, currentStatus) => {
  try {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await updateWish(wishId, { status: newStatus });
    return newStatus;
  } catch (error) {
    console.error('Error toggling wish status:', error);
    throw error;
  }
};
