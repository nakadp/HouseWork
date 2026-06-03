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
    }
};
