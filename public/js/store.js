import { getDb } from './services/firebase.js?v=17';
import { collection, doc, query, where, orderBy, onSnapshot, addDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Static library to avoid complex seeding for now
export const store = {
    choresLibrary: {
        activeCategory: '客厅',
        categories: ['客厅', '厨房', '卧室', '卫生间'],
        chores: {
            '客厅': [
                { id: 1, name: '扫地', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="m21 16-4-4"/><path d="M12 21 8 17"/><path d="m8 17-4-4"/><path d="m21 16-5.5-5.5"/><path d="M15.5 10.5 12 7"/><path d="m12 7-4-4"/><path d="m4 3 17 17"/></svg>' },
                { id: 2, name: '拖地', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/><path d="M17 12h5"/><path d="M2 12h5"/></svg>' },
                { id: 3, name: '倒垃圾', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>' }
            ],
            '厨房': [
                { id: 4, name: '洗碗', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 15h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2Z"/></svg>' },
                { id: 5, name: '擦灶台', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4Z"/><path d="M3 10v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8"/><path d="M12 10v10"/><path d="M8 14h8"/></svg>' }
            ],
            '卧室': [
                { id: 6, name: '整理床铺', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>' },
                { id: 7, name: '衣物收纳', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>' }
            ],
            '卫生间': [
                { id: 8, name: '洗马桶', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M9 16v2"/><path d="M15 16v2"/><path d="M12 16v4"/><path d="M5 8h14"/><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Z"/><path d="M12 4v4"/><path d="M8 4h8"/><path d="M9 4V2h6v2"/></svg>' },
                { id: 9, name: '补纸巾', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><path d="M12 12v4"/></svg>' }
            ]
        }
    },
    planTemplates: [
        { id: 1, name: '日常保洁', chores: [1, 2, 4], duration: '约30分钟' },
        { id: 2, name: '周末大扫除', chores: [1, 2, 3, 4, 5, 6, 8], duration: '约2小时' },
        { id: 3, name: '睡前整理', chores: [4, 6], duration: '约15分钟' }
    ],
    nextTodayId: 100,
    nextTemplateId: 10,
    genericIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>',
    
    getLibraryChore(id) {
        for (let cat in this.choresLibrary.chores) {
            let found = this.choresLibrary.chores[cat].find(c => c.id === id);
            if (found) return { ...found, category: cat };
        }
        return null;
    },

    // In-memory state for UI components that haven't been fully migrated
    todayChores: [],
    activeSupplies: [],
    _sharedMockRecords: [],

    // For backwards compatibility with views that still call this synchronously
    getSharedMockRecords() {
        return this._sharedMockRecords;
    },

    // ==========================================
    // REAL FIREBASE BACKEND METHODS
    // ==========================================

    /**
     * Start listening to Firestore records collection
     */
    listenToRecords(familyId, callback) {
        const db = getDb();
        if (!db) return;

        const q = query(
            collection(db, `families/${familyId}/records`),
            orderBy('completed_at', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const records = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                records.push({
                    id: doc.id,
                    ...data,
                    // Convert Firestore Timestamp to JS Date for frontend compatibility
                    completed_at: data.completed_at ? data.completed_at.toDate() : new Date()
                });
            });
            this._sharedMockRecords = records;
            if (callback) callback(records);
        });
    },

    /**
     * Add a real record to Firestore
     */
    async addSharedMockRecord(chore, memberId, hasPhoto = false, photoUrl = null, profile = null) {
        const db = getDb();
        if (!db) return null;

        const familyId = localStorage.getItem('user_family_id') || 'family_abc123';
        
        // Use provided profile or fallback
        const memberName = profile ? profile.displayName : '家庭成员';
        const memberAvatar = profile && profile.pictureUrl ? profile.pictureUrl : 'https://ui-avatars.com/api/?name=U';
        
        const newRecord = {
            completed_at: serverTimestamp(),
            completed_by: memberId,
            completed_by_name: memberName,
            completed_by_avatar: memberAvatar,
            memberName: memberName, // Legacy support
            avatar: memberAvatar, // Legacy support
            color: 'blue', // Can map from member list later
            choreName: chore.name,
            chore_title: chore.name,
            area: chore.category || '通用',
            photo_url: photoUrl,
            likes: [],
            comments_count: 0
        };

        try {
            const docRef = await addDoc(collection(db, `families/${familyId}/records`), newRecord);
            return { id: docRef.id, ...newRecord, completed_at: new Date() };
        } catch (e) {
            console.error("Error adding record: ", e);
            return null;
        }
    },
    
    async setLike(recordId, userId, isLike) {
        const db = getDb();
        if (!db) return;
        const familyId = localStorage.getItem('user_family_id') || 'family_abc123';
        const recordRef = doc(db, `families/${familyId}/records`, recordId);
        
        if (isLike) {
            await updateDoc(recordRef, { likes: arrayUnion(userId) });
        } else {
            await updateDoc(recordRef, { likes: arrayRemove(userId) });
        }
    },

    /**
     * Real Supply Memo logic using a subcollection
     */
    listenToActiveSupplies(familyId, callback) {
        const db = getDb();
        if (!db) return;

        const q = query(
            collection(db, `families/${familyId}/supplies`),
            where('is_completed', '==', false),
            orderBy('created_at', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const supplies = [];
            snapshot.forEach(doc => {
                supplies.push({ id: doc.id, ...doc.data() });
            });
            this.activeSupplies = supplies;
            if (callback) callback(supplies);
        });
    },

    async addSupplyMemo(itemName, creatorId) {
        const db = getDb();
        if (!db) return;
        const familyId = localStorage.getItem('user_family_id') || 'family_abc123';

        await addDoc(collection(db, `families/${familyId}/supplies`), {
            name: itemName,
            creatorId: creatorId,
            is_completed: false,
            created_at: serverTimestamp()
        });
    },

    async completeSupplyMemo(supplyId, completerId, profile) {
        const db = getDb();
        if (!db) return;
        const familyId = localStorage.getItem('user_family_id') || 'family_abc123';
        
        const supplyRef = doc(db, `families/${familyId}/supplies`, supplyId);
        await updateDoc(supplyRef, { is_completed: true });

        // Retrieve supply name to add to record (simplified)
        const supply = this.activeSupplies.find(s => s.id === supplyId);
        const name = supply ? supply.name : "未知物品";

        const mockChore = {
            name: `[耗材补充] ${name}`,
            category: '系统'
        };
        await this.addSharedMockRecord(mockChore, completerId, false, null, profile);
    }
};
