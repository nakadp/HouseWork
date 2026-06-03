import { getDb } from '../services/firebase.js';
import { store } from '../store.js?v=7';

let firestoreModule = null;

export const HistoryView = {
    state: {
        currentYear: 2026,
        currentMonth: 6,
        records: [], // memory cache
        selectedDay: 15,
        unsubscribe: null
    },

    render() {
        return `
            <div class="view-section active" style="position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="font-size: 24px; font-weight: 700;">历史与统计</h2>
                    <div style="display: flex; gap: 8px;">
                        <select id="filter-member" style="padding: 6px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--surface-solid); color: var(--text-primary); font-size: 12px; outline: none;">
                            <option value="all">全家人</option>
                            <option value="dad">爸爸</option>
                            <option value="mom">妈妈</option>
                            <option value="kid">孩子</option>
                        </select>
                        <select id="filter-month" style="padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--accent-color); background: rgba(0,255,102,0.1); color: var(--accent-color); font-weight: 700; box-shadow: var(--accent-glow); outline: none;">
                            <option value="2026-6">2026年6月</option>
                            <option value="2026-5">2026年5月</option>
                        </select>
                    </div>
                </div>
                
                <!-- Tab Controls -->
                <div style="display: flex; gap: 8px; background: rgba(0,0,0,0.5); padding: 4px; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--border-color);">
                    <button id="tab-calendar" style="flex: 1; padding: 10px; border-radius: 8px; border: none; background: var(--surface-color); color: var(--accent-color); font-weight: 700; font-size: 14px; box-shadow: var(--accent-glow); cursor: pointer; transition: all 0.2s;">
                        📅 日历
                    </button>
                    <button id="tab-stats" style="flex: 1; padding: 10px; border-radius: 8px; border: none; background: transparent; color: var(--text-secondary); font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s;">
                        📊 统计
                    </button>
                </div>

                <!-- Calendar View -->
                <div id="view-calendar">
                    <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 12px; font-weight: 700; padding: 16px 0; background: var(--surface-solid); border-bottom: 1px solid var(--border-color); color: var(--text-secondary);">
                            <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
                        </div>
                        <div id="calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border-color);">
                            <!-- JS Generated Grid -->
                        </div>
                    </div>

                    <h3 style="margin-bottom: 16px; font-size: 18px; font-weight: 700;">
                        <span id="day-title">今日</span>详情
                    </h3>
                    <div id="day-details" class="card" style="display: flex; flex-direction: column; gap: 16px; min-height: 100px;">
                        <!-- JS Generated Details -->
                    </div>
                </div>

                <!-- Stats View -->
                <div id="view-stats" style="display: none;">
                    <div class="card" style="margin-bottom: 20px;">
                        <h3 style="font-size: 14px; font-weight: 700; color: var(--text-secondary); margin-bottom: 16px; text-align: center;">参与度趋势 (次数)</h3>
                        <div style="position: relative; height: 220px; width: 100%;">
                            <canvas id="chart-person"></canvas>
                        </div>
                    </div>
                    <div class="card">
                        <h3 style="font-size: 14px; font-weight: 700; color: var(--text-secondary); margin-bottom: 16px; text-align: center;">家务类型分布</h3>
                        <div style="position: relative; height: 200px; width: 100%; display: flex; justify-content: center;">
                            <canvas id="chart-type"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Lightbox (Hidden) -->
                <div id="lightbox" style="display: none; position: fixed; inset: -20px; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: 3000; align-items: center; justify-content: center; cursor: zoom-out;">
                    <img id="lightbox-img" src="" style="max-width: 90%; max-height: 80vh; border-radius: 12px; box-shadow: 0 0 40px rgba(0,255,102,0.2); transition: transform 0.3s ease-out; transform: scale(0.9);">
                </div>
            </div>
        `;
    },

    async mount(container) {
        container.innerHTML = this.render();
        this.container = container;
        
        this.dom = {
            filterMonth: container.querySelector('#filter-month'),
            filterMember: container.querySelector('#filter-member'),
            tabCalendar: container.querySelector('#tab-calendar'),
            tabStats: container.querySelector('#tab-stats'),
            viewCalendar: container.querySelector('#view-calendar'),
            viewStats: container.querySelector('#view-stats'),
            grid: container.querySelector('#calendar-grid'),
            dayTitle: container.querySelector('#day-title'),
            dayDetails: container.querySelector('#day-details'),
            lightbox: container.querySelector('#lightbox'),
            lightboxImg: container.querySelector('#lightbox-img'),
            ctxPerson: container.querySelector('#chart-person').getContext('2d'),
            ctxType: container.querySelector('#chart-type').getContext('2d')
        };

        this.chartsInitialized = false;

        // Tabs
        const switchTab = (tab) => {
            if (tab === 'calendar') {
                this.dom.tabCalendar.style.background = 'var(--surface-color)';
                this.dom.tabCalendar.style.color = 'var(--accent-color)';
                this.dom.tabCalendar.style.boxShadow = 'var(--accent-glow)';
                this.dom.tabStats.style.background = 'transparent';
                this.dom.tabStats.style.color = 'var(--text-secondary)';
                this.dom.tabStats.style.boxShadow = 'none';
                
                this.dom.viewCalendar.style.display = 'block';
                this.dom.viewStats.style.display = 'none';
            } else {
                this.dom.tabStats.style.background = 'var(--surface-color)';
                this.dom.tabStats.style.color = 'var(--accent-color)';
                this.dom.tabStats.style.boxShadow = 'var(--accent-glow)';
                this.dom.tabCalendar.style.background = 'transparent';
                this.dom.tabCalendar.style.color = 'var(--text-secondary)';
                this.dom.tabCalendar.style.boxShadow = 'none';
                
                this.dom.viewCalendar.style.display = 'none';
                this.dom.viewStats.style.display = 'block';
                
                if (!this.chartsInitialized) {
                    setTimeout(() => this.initCharts(), 10);
                    this.chartsInitialized = true;
                } else {
                    this.updateCharts();
                }
            }
        };

        this.dom.tabCalendar.addEventListener('click', () => switchTab('calendar'));
        this.dom.tabStats.addEventListener('click', () => switchTab('stats'));

        // Filters
        this.dom.filterMonth.addEventListener('change', (e) => {
            const [y, m] = e.target.value.split('-');
            this.state.currentYear = parseInt(y);
            this.state.currentMonth = parseInt(m);
            this.state.selectedDay = 1; // reset day
            this.fetchMonthlyData();
        });

        this.dom.filterMember.addEventListener('change', () => {
            // Memory Filter triggers re-render only
            this.renderCalendar();
            this.renderDayDetails();
            if(this.dom.viewStats.style.display === 'block') this.updateCharts();
        });

        // Lightbox
        this.dom.lightbox.addEventListener('click', () => {
            this.dom.lightboxImg.style.transform = 'scale(0.9)';
            setTimeout(() => this.dom.lightbox.style.display = 'none', 100);
        });

        // Init
        await this.fetchMonthlyData();
    },

    async fetchMonthlyData() {
        if (this.state.unsubscribe) {
            this.state.unsubscribe();
        }

        try {
            const db = getDb();
            if (!db) throw new Error("No DB");
            
            if (!firestoreModule) {
                firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
            }
            const { collection, query, where, onSnapshot } = firestoreModule;
            
            const startOfMonth = new Date(this.state.currentYear, this.state.currentMonth - 1, 1);
            const endOfMonth = new Date(this.state.currentYear, this.state.currentMonth, 0, 23, 59, 59);

            const q = query(
                collection(db, `families/demo-family/records`),
                where("completed_at", ">=", startOfMonth),
                where("completed_at", "<=", endOfMonth)
            );

            this.state.unsubscribe = onSnapshot(q, (snapshot) => {
                this.state.records = snapshot.docs.map(doc => {
                    const data = doc.data();
                    if (data.completed_at && data.completed_at.toDate) {
                        data.completed_at = data.completed_at.toDate();
                    }
                    return data;
                });
                this.refreshUI();
            }, (error) => {
                console.warn("Firestore snapshot error, falling back to mock.", error);
                this.fallbackToMock();
            });
            
        } catch (e) {
            console.log("Using local mock data for history view (No valid DB Connection).");
            this.fallbackToMock();
        }
    },

    fallbackToMock() {
        const allMocks = store.getSharedMockRecords();
        // Filter by currently selected year and month
        this.state.records = allMocks.filter(r => {
            return r.completed_at.getFullYear() === this.state.currentYear && 
                   r.completed_at.getMonth() === (this.state.currentMonth - 1);
        });
        this.refreshUI();
    },

    refreshUI() {
        this.renderCalendar();
        this.renderDayDetails();
        if (this.chartsInitialized) {
            this.updateCharts();
        }
    },

    getFilteredRecords() {
        const memberId = this.dom.filterMember.value;
        if (memberId === 'all') return this.state.records;
        return this.state.records.filter(r => r.memberId === memberId);
    },

    renderCalendar() {
        const records = this.getFilteredRecords();
        const year = this.state.currentYear;
        const month = this.state.currentMonth;
        
        const firstDay = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();
        
        const dotsMap = {};
        for(let i = 1; i <= daysInMonth; i++) dotsMap[i] = new Set();
        
        records.forEach(r => {
            const d = r.completed_at.getDate();
            if (dotsMap[d] && r.color) dotsMap[d].add(r.color);
        });

        let html = '';
        
        for (let i = 0; i < firstDay; i++) {
            const prevMonthDays = new Date(year, month - 1, 0).getDate();
            const d = prevMonthDays - firstDay + i + 1;
            html += `<div style="background: var(--surface-color); min-height: 60px; padding: 4px; font-weight: 600; text-align: center; color: var(--text-secondary); opacity: 0.3;">${d}</div>`;
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const isActive = i === this.state.selectedDay;
            
            let todayStyle = 'background: var(--surface-color); color: var(--text-primary); border: 1px solid transparent;';
            if (isActive) {
                todayStyle = 'background: rgba(0,255,102,0.1); border: 1px solid var(--accent-color); color: var(--accent-color); text-shadow: var(--accent-glow); box-shadow: inset 0 0 10px rgba(0,255,102,0.1);';
            }

            let dotsHtml = '';
            dotsMap[i].forEach(color => {
                dotsHtml += `<div class="neon-dot ${color}"></div>`;
            });

            html += `
                <div class="cal-day" data-day="${i}" style="${todayStyle} min-height: 60px; padding: 6px; font-weight: 700; text-align: center; position: relative; cursor: pointer; transition: all 0.2s;">
                    ${i}
                    <div style="display: flex; justify-content: center; gap: 4px; margin-top: 8px; flex-wrap: wrap;">
                        ${dotsHtml}
                    </div>
                </div>
            `;
        }
        
        const totalCells = firstDay + daysInMonth;
        const remainder = totalCells % 7;
        if (remainder !== 0) {
            for (let i = 1; i <= 7 - remainder; i++) {
                html += `<div style="background: var(--surface-color); min-height: 60px; padding: 4px; font-weight: 600; text-align: center; color: var(--text-secondary); opacity: 0.3;">${i}</div>`;
            }
        }

        this.dom.grid.innerHTML = html;

        this.dom.grid.querySelectorAll('.cal-day').forEach(el => {
            el.addEventListener('click', (e) => {
                this.state.selectedDay = parseInt(e.currentTarget.dataset.day);
                this.renderCalendar(); 
                this.renderDayDetails();
            });
        });
    },

    renderDayDetails() {
        this.dom.dayTitle.textContent = `${this.state.currentMonth}月${this.state.selectedDay}日`;
        const records = this.getFilteredRecords().filter(r => r.completed_at.getDate() === this.state.selectedDay);
        
        if (records.length === 0) {
            this.dom.dayDetails.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 20px; font-size: 14px;">当天无记录</div>`;
            return;
        }

        let html = '';
        records.forEach((r, idx) => {
            if (idx > 0) {
                html += `<div style="height: 1px; background: var(--border-color); margin: 12px 0;"></div>`;
            }
            
            let photoHtml = '';
            if (r.photo_url) {
                photoHtml = `
                    <div style="margin-top: 12px;">
                        <img src="${r.photo_url}" class="lightbox-trigger" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); cursor: zoom-in; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                    </div>
                `;
            }

            html += `
                <div style="display: flex; gap: 12px;">
                    <img src="${r.avatar}" style="width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border-color); background: #000;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <h4 style="font-size: 14px; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                                <div class="neon-dot ${r.color}"></div> ${r.memberName}
                            </h4>
                            <span style="color: var(--accent-color); font-size: 12px; font-weight: 600;">已完成 ✓</span>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">完成了 <strong>${r.choreName}</strong></p>
                        ${photoHtml}
                    </div>
                </div>
            `;
        });
        
        this.dom.dayDetails.innerHTML = html;

        this.dom.dayDetails.querySelectorAll('.lightbox-trigger').forEach(img => {
            img.addEventListener('click', (e) => {
                this.dom.lightboxImg.src = e.target.src;
                this.dom.lightbox.style.display = 'flex';
                void this.dom.lightboxImg.offsetWidth;
                this.dom.lightboxImg.style.transform = 'scale(1)';
            });
        });
    },

    initCharts() {
        if (!window.Chart) return;
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = "'Inter', sans-serif";

        const neonGlowPlugin = {
            id: 'neonGlow',
            beforeDatasetsDraw: (chart) => {
                const ctx = chart.ctx;
                ctx.save();
                ctx.shadowColor = 'rgba(0, 255, 102, 0.5)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            },
            afterDatasetsDraw: (chart) => {
                chart.ctx.restore();
            }
        };

        this.chartPerson = new Chart(this.dom.ctxPerson, {
            type: 'line',
            plugins: [neonGlowPlugin],
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cubicInterpolationMode: 'monotone', 
                plugins: {
                    legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 6 } }
                },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { 
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        beginAtZero: true,
                        ticks: { stepSize: 2 }
                    }
                }
            }
        });

        this.chartType = new Chart(this.dom.ctxType, {
            type: 'doughnut',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%', 
                plugins: {
                    legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 6, padding: 15 } }
                }
            }
        });

        this.updateCharts();
    },

    updateCharts() {
        if (!this.chartPerson || !this.chartType) return;
        const records = this.getFilteredRecords();

        const weekData = { dad: [0,0,0,0], mom: [0,0,0,0], kid: [0,0,0,0] };
        records.forEach(r => {
            const day = r.completed_at.getDate();
            const week = Math.min(Math.floor((day - 1) / 7), 3);
            if (weekData[r.memberId]) weekData[r.memberId][week]++;
        });

        this.chartPerson.data = {
            labels: ['第一周', '第二周', '第三周', '第四周'],
            datasets: [
                {
                    label: '爸爸', data: weekData.dad,
                    borderColor: '#0ea5e9', borderWidth: 3, tension: 0.4,
                    pointBackgroundColor: '#fff', pointBorderWidth: 2, pointRadius: 4
                },
                {
                    label: '妈妈', data: weekData.mom,
                    borderColor: '#ef4444', borderWidth: 3, tension: 0.4,
                    pointBackgroundColor: '#fff', pointBorderWidth: 2, pointRadius: 4
                },
                {
                    label: '孩子', data: weekData.kid,
                    borderColor: '#00ff66', borderWidth: 3, tension: 0.4,
                    pointBackgroundColor: '#fff', pointBorderWidth: 2, pointRadius: 4
                }
            ]
        };
        this.chartPerson.update();

        const typeCount = {};
        records.forEach(r => {
            typeCount[r.choreName] = (typeCount[r.choreName] || 0) + 1;
        });
        
        const labels = Object.keys(typeCount);
        const data = Object.values(typeCount);

        this.chartType.data = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#00ff66', '#0ea5e9', '#ef4444', '#f59e0b', '#a855f7', '#ec4899', '#64748b'],
                borderWidth: 0,
                hoverOffset: 5
            }]
        };
        this.chartType.update();
    }
};
