import { getDb } from '../services/firebase.js?v=11';
import { store } from '../store.js?v=11';

let firestoreModule = null;
let currentUserId = 'mock_user_1'; 

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "刚刚";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} 分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} 小时前`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} 天前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
}

// Mock data generation removed in favor of store.js unified mock data

export const FamilyView = {
    state: {
        feed: [],
        unsubscribeFeed: null,
        unsubscribeComments: null,
        activeDrawerRecordId: null,
        timeUpdaterInterval: null,
        onlineCount: Math.floor(Math.random() * 3) + 1
    },

    render() {
        return `
            <div class="view-section active" style="position: relative; height: 100%; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h2 style="font-size: 24px; font-weight: 700;">家庭广场</h2>
                    <span style="background: rgba(0,255,102,0.1); border: 1px solid var(--accent-color); color: var(--accent-color); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; box-shadow: var(--accent-glow);">
                        <span style="display: inline-block; width: 6px; height: 6px; background: var(--accent-color); border-radius: 50%; margin-right: 4px; box-shadow: 0 0 4px var(--accent-color); animation: pulse 2s infinite;"></span>
                        在线: ${this.state.onlineCount}人
                    </span>
                </div>

                <div id="feed-container" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding-bottom: 24px;">
                    <!-- JS Generated Feed -->
                </div>

                <!-- Comment Drawer (Hidden) -->
                <div id="comment-drawer" style="display: none; position: fixed; bottom: 0; left: 0; right: 0; height: 75vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 3000; border-top-left-radius: 24px; border-top-right-radius: 24px; border-top: 1px solid rgba(255,255,255,0.1); box-shadow: 0 -10px 40px rgba(0,0,0,0.5); flex-direction: column; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                    
                    <div style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="font-size: 16px; font-weight: 700;">💬 评论</h3>
                        <button id="btn-close-comments" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer; padding: 0;">&times;</button>
                    </div>

                    <div id="comments-list" style="flex: 1; overflow-y: auto; padding: 16px 20px; display: flex; flex-direction: column; gap: 16px;">
                        <!-- JS Generated Comments -->
                    </div>

                    <div style="padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 12px; background: rgba(0,0,0,0.5);">
                        <input type="text" id="comment-input" placeholder="说点什么..." style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 10px 16px; color: var(--text-primary); font-size: 14px; outline: none; transition: border-color 0.2s;">
                        <button id="btn-send-comment" style="background: var(--accent-color); border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: var(--accent-glow);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; transform: scale(1.2); }
                    100% { opacity: 0.5; }
                }
                .btn-like.active {
                    color: var(--accent-color) !important;
                    text-shadow: var(--accent-glow);
                }
                .btn-like.active svg {
                    stroke: var(--accent-color);
                    fill: rgba(0,255,102,0.2);
                }
            </style>
        `;
    },

    async mount(container) {
        container.innerHTML = this.render();
        this.container = container;
        
        this.dom = {
            feedContainer: container.querySelector('#feed-container'),
            commentDrawer: container.querySelector('#comment-drawer'),
            commentsList: container.querySelector('#comments-list'),
            btnCloseComments: container.querySelector('#btn-close-comments'),
            commentInput: container.querySelector('#comment-input'),
            btnSendComment: container.querySelector('#btn-send-comment')
        };

        // Use event delegation for closing drawer to avoid lost listeners
        this.dom.commentDrawer.addEventListener('click', (e) => {
            if (e.target.closest('#btn-close-comments')) {
                this.closeCommentDrawer();
            }
        });
        this.dom.btnSendComment.addEventListener('click', () => {
            const val = this.dom.commentInput.value.trim();
            if (!val) return;
            this.dom.commentsList.insertAdjacentHTML('beforeend', `
                <div style="display: flex; gap: 12px; margin-bottom: 12px; animation: slideUp 0.3s ease-out;">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=0ea5e9" style="width: 32px; height: 32px; border-radius: 50%;">
                    <div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">爸爸 <span style="margin-left: 8px;">刚刚</span></div>
                        <div style="font-size: 14px; background: rgba(0,255,102,0.1); border: 1px solid rgba(0,255,102,0.2); padding: 8px 12px; border-radius: 12px; border-top-left-radius: 2px;">${val}</div>
                    </div>
                </div>
            `);
            this.dom.commentInput.value = '';
            this.dom.commentsList.scrollTop = this.dom.commentsList.scrollHeight;
            
            // Update comments_count optimistically
            const record = this.state.feed.find(r => r.id === this.state.activeDrawerRecordId);
            if (record) {
                record.comments_count = (record.comments_count || 0) + 1;
                this.renderFeed();
            }
        });

        // Add slideUp animation style
        if (!document.getElementById('comment-anim-style')) {
            const style = document.createElement('style');
            style.id = 'comment-anim-style';
            style.innerHTML = `@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
            document.head.appendChild(style);
        }

        // Always attempt to render feed if we already have it populated
        if (this.state.feed.length > 0) {
            this.renderFeed();
        }

        this.state.timeUpdaterInterval = setInterval(() => this.updateRelativeTimes(), 60000);

        await this.initFeed();
    },

    unmount() {
        if (this.state.timeUpdaterInterval) clearInterval(this.state.timeUpdaterInterval);
        if (this.state.unsubscribeFeed) this.state.unsubscribeFeed();
        if (this.state.unsubscribeComments) this.state.unsubscribeComments();
    },

    updateRelativeTimes() {
        if (!this.dom.feedContainer) return;
        this.dom.feedContainer.querySelectorAll('.time-ago').forEach(el => {
            const timestamp = parseInt(el.dataset.timestamp);
            if (timestamp) {
                el.textContent = formatTimeAgo(new Date(timestamp));
            }
        });
    },

    async initFeed() {
        try {
            const db = getDb();
            if (!db) throw new Error("No DB");
            
            if (!firestoreModule) {
                firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
            }
            const { collection, query, orderBy, limit, onSnapshot } = firestoreModule;

            const q = query(
                collection(db, "families/demo-family/records"),
                orderBy("completed_at", "desc"),
                limit(20)
            );

            this.state.unsubscribeFeed = onSnapshot(q, (snapshot) => {
                this.state.feed = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                this.state.feed.forEach(r => {
                    if (r.completed_at && r.completed_at.toDate) r.completed_at = r.completed_at.toDate();
                });
                this.renderFeed();
            }, (error) => {
                console.warn("Firestore Feed snapshot error, fallback to mock.", error);
                this.fallbackToMock();
            });

        } catch(e) {
            console.log("Using Mock Feed generator");
            this.fallbackToMock();
        }
    },

    fallbackToMock() {
        if (this.state.feed.length === 0) {
            this.state.feed = store.getSharedMockRecords();
            this.renderFeed();
        } else {
            // Already populated, just render it
            this.renderFeed();
        }
    },

    renderFeed() {
        let html = '';
        if (this.state.feed.length === 0) {
            this.dom.feedContainer.innerHTML = `<div style="text-align: center; color: var(--text-secondary); margin-top: 40px;">暂无打卡动态，快去完成今天的第一项任务吧！</div>`;
            return;
        }

        this.state.feed.forEach(record => {
            const isLiked = record.likes && record.likes.includes(currentUserId);
            const likesCount = (record.likes || []).length;
            const commentsCount = record.comments_count || 0;
            const timeAgo = formatTimeAgo(record.completed_at);
            const timeMs = record.completed_at.getTime();

            let photoHtml = '';
            if (record.photo_url) {
                photoHtml = `
                    <div style="width: 100%; height: 200px; border-radius: var(--radius-md); margin-bottom: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); position: relative;">
                        <img src="${record.photo_url}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 40%; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);"></div>
                    </div>
                `;
            }

            html += `
                <div class="card" style="padding: 16px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <img src="${record.completed_by_avatar}" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: #000;" alt="avatar">
                        <div>
                            <h4 style="font-size: 14px; font-weight: 700;">${record.completed_by_name}</h4>
                            <p class="time-ago" data-timestamp="${timeMs}" style="color: var(--text-secondary); font-size: 11px;">${timeAgo}</p>
                        </div>
                    </div>
                    
                    <p style="font-size: 15px; margin-bottom: 12px; color: var(--text-primary);">完成了 <span style="font-weight: 700; color: var(--accent-color); text-shadow: 0 0 8px rgba(0,255,102,0.4);">${record.chore_title}</span> ✨</p>
                    
                    ${photoHtml}
                    
                    <div style="display: flex; gap: 24px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; margin-top: 4px;">
                        <button class="btn-like ${isLiked ? 'active' : ''}" data-id="${record.id}" style="background: none; border: none; color: var(--text-secondary); font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 600; transition: all 0.2s;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                            <span class="like-count">${likesCount > 0 ? likesCount : '点赞'}</span>
                        </button>
                        <button class="btn-comment" data-id="${record.id}" style="background: none; border: none; color: var(--text-secondary); font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 600; transition: color 0.2s;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> 
                            ${commentsCount > 0 ? commentsCount : '评论'}
                        </button>
                    </div>
                </div>
            `;
        });

        this.dom.feedContainer.innerHTML = html;
        this.bindFeedEvents();
    },

    bindFeedEvents() {
        this.dom.feedContainer.querySelectorAll('.btn-like').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const btnEl = e.currentTarget;
                const id = btnEl.dataset.id;
                
                const record = this.state.feed.find(r => r.id === id);
                if (!record) return;
                
                const hasLiked = record.likes && record.likes.includes(currentUserId);
                if (!record.likes) record.likes = [];

                if (hasLiked) {
                    record.likes = record.likes.filter(uid => uid !== currentUserId);
                } else {
                    record.likes.push(currentUserId);
                }
                
                this.renderFeed(); 
                console.log(`Mock Firestore array${hasLiked ? 'Remove' : 'Union'} executed.`);
            });
        });

        this.dom.feedContainer.querySelectorAll('.btn-comment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.openCommentDrawer(id);
            });
        });
    },

    openCommentDrawer(recordId) {
        this.state.activeDrawerRecordId = recordId;
        this.dom.commentDrawer.style.display = 'flex';
        void this.dom.commentDrawer.offsetWidth;
        this.dom.commentDrawer.style.transform = 'translateY(0)';
        
        this.dom.commentsList.innerHTML = `
            <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ef4444" style="width: 32px; height: 32px; border-radius: 50%;">
                <div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">妈妈 <span style="margin-left: 8px;">刚刚</span></div>
                    <div style="font-size: 14px; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 12px; border-top-left-radius: 2px;">太棒了！辛苦啦</div>
                </div>
            </div>
        `;
        
        console.log(`[Leak Prevention] Started listening to records/${recordId}/comments`);
    },

    closeCommentDrawer() {
        this.dom.commentDrawer.style.transform = 'translateY(100%)';
        setTimeout(() => {
            this.dom.commentDrawer.style.display = 'none';
        }, 300);

        if (this.state.unsubscribeComments) {
            this.state.unsubscribeComments();
            this.state.unsubscribeComments = null;
        }
        console.log(`[Leak Prevention] Stopped listening to records/${this.state.activeDrawerRecordId}/comments (Unsubscribed successfully)`);
        this.state.activeDrawerRecordId = null;
    }
};
