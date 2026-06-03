export const store = {
    choresLibrary: {
        activeCategory: '客厅',
        categories: ['客厅', '厨房', '卧室', '卫生间'],
        chores: {
            '客厅': [
                { id: 1, name: '扫地', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="m21 16-4-4"/><path d="M12 21 8 17"/><path d="m8 17-4-4"/><path d="m21 16-5.5-5.5"/><path d="M15.5 10.5 12 7"/><path d="m12 7-4-4"/><path d="m4 3 17 17"/></svg>' },
                { id: 2, name: '拖地', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/><path d="M17 12h5"/><path d="M2 12h5"/></svg>' },
                { id: 3, name: '浇花', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>' }
            ],
            '厨房': [
                { id: 4, name: '洗碗', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 15h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2Z"/></svg>' },
                { id: 5, name: '清理油烟机', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>' }
            ],
            '卧室': [
                { id: 6, name: '整理床铺', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>' }
            ],
            '卫生间': [
                { id: 7, name: '刷马桶', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><path d="M9 22h6"/><path d="M9 16v6"/><path d="M15 16v6"/><path d="M18 16a6 6 0 0 0-12 0"/><path d="M4.5 9.5a6.5 6.5 0 0 1 15 0"/><path d="M12 3v1"/></svg>' }
            ]
        },
        nextId: 8
    },
    todayChores: [
        { id: 101, baseId: 4, name: '洗碗', category: '厨房', isCompleted: false },
        { id: 102, baseId: 1, name: '扫地', category: '客厅', isCompleted: true }
    ],
    nextTodayId: 103,
    planTemplates: [
        { id: 201, name: '周末大扫除', chores: [1, 2, 5], duration: '120 分钟' },
        { id: 202, name: '十分钟快速', chores: [1, 6], duration: '10 分钟' }
    ],
    nextTemplateId: 203,
    genericIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-white"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>',
    
    // Helper to get a chore from library by its ID
    getLibraryChore(id) {
        for (let cat in this.choresLibrary.chores) {
            let found = this.choresLibrary.chores[cat].find(c => c.id === id);
            if (found) return { ...found, category: cat };
        }
        return null;
    },
    
    // Unified Mock Data generator for Family and History views
    _sharedMockRecords: null,
    getSharedMockRecords() {
        if (this._sharedMockRecords) return this._sharedMockRecords;
        
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const data = [];
        
        const members = [
            { id: 'mock_user_1', name: '爸爸', color: 'blue', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=0ea5e9' },
            { id: 'mock_user_2', name: '妈妈', color: 'red', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ef4444' },
            { id: 'mock_user_3', name: '孩子', color: 'green', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=00ff66' }
        ];
        const choreTypes = ['洗碗', '扫拖地', '洗衣', '清理油烟机', '整理床铺'];
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let recordIdCounter = 1;
        
        for (let i = 1; i <= daysInMonth; i++) {
            // Only generate mock data for PAST days, leave today empty for actual testing
            if (i < now.getDate() && Math.random() > 0.3) {
                let numChores = Math.floor(Math.random() * 3) + 1;
                for (let j = 0; j < numChores; j++) {
                    const member = members[Math.floor(Math.random() * members.length)];
                    const hasPhoto = Math.random() > 0.7;
                    const date = new Date(year, month, i, 12 + j, Math.floor(Math.random() * 60), 0);
                    
                    data.push({
                        id: `mock_rec_${recordIdCounter++}`,
                        completed_at: date,
                        memberId: member.id, // For history.js filtering
                        completed_by: member.id, // For family.js
                        memberName: member.name, // History
                        completed_by_name: member.name, // Family
                        color: member.color,
                        avatar: member.avatar,
                        completed_by_avatar: member.avatar,
                        choreName: choreTypes[Math.floor(Math.random() * choreTypes.length)],
                        chore_title: choreTypes[Math.floor(Math.random() * choreTypes.length)],
                        photo_url: hasPhoto ? 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80' : null,
                        likes: Math.random() > 0.5 ? ['mock_user_2'] : [],
                        comments_count: Math.floor(Math.random() * 3)
                    });
                }
            }
        }
        
        // Sort newest first
        data.sort((a, b) => b.completed_at - a.completed_at);
        this._sharedMockRecords = data;
        return data;
    },

    // Method to simulate adding a new record globally
    addSharedMockRecord(chore, memberId = 'mock_user_1', hasPhoto = false) {
        if (!this._sharedMockRecords) {
            this.getSharedMockRecords(); // initialize if empty
        }

        const members = {
            'mock_user_1': { name: '爸爸', color: 'blue', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=0ea5e9' },
            'mock_user_2': { name: '妈妈', color: 'red', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ef4444' },
            'mock_user_3': { name: '孩子', color: 'green', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=00ff66' }
        };
        const member = members[memberId] || members['mock_user_1'];

        const newRecord = {
            id: `mock_rec_new_${Date.now()}`,
            completed_at: new Date(),
            memberId: memberId,
            completed_by: memberId,
            memberName: member.name,
            completed_by_name: member.name,
            color: member.color,
            avatar: member.avatar,
            completed_by_avatar: member.avatar,
            choreName: chore.name,
            chore_title: chore.name,
            area: chore.category,
            photo_url: hasPhoto ? 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80' : null,
            likes: [],
            comments_count: 0
        };

        // Add to top of the feed
        this._sharedMockRecords.unshift(newRecord);
        return newRecord;
    },

    // Supplies Memo State
    activeSupplies: [],
    
    addSupplyMemo(itemName, creatorId = 'mock_user_1') {
        const supply = {
            id: `supply_${Date.now()}`,
            name: itemName,
            creatorId: creatorId,
            created_at: new Date()
        };
        this.activeSupplies.unshift(supply);
        return supply;
    },

    completeSupplyMemo(supplyId, completerId = 'mock_user_1') {
        const index = this.activeSupplies.findIndex(s => s.id === supplyId);
        if (index > -1) {
            const supply = this.activeSupplies[index];
            this.activeSupplies.splice(index, 1);
            
            // Treat as a completed chore
            const mockChore = {
                name: `[耗材补充] ${supply.name}`,
                category: '系统'
            };
            return this.addSharedMockRecord(mockChore, completerId, false);
        }
        return null;
    }
};
