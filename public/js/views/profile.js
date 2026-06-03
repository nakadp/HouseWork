import { getUserProfile, shareFamilyInvite } from '../services/liff.js?v=17';
import { store } from '../store.js?v=17';

// Gamification logic
function getBadge(choresCount) {
    if (choresCount <= 5) {
        return { text: '🧹 萌新管家', style: 'background: rgba(255,255,255,0.1); color: var(--text-secondary); border: 1px solid rgba(255,255,255,0.2);' };
    } else if (choresCount <= 20) {
        return { text: '👑 家务小能手', style: 'background: linear-gradient(135deg, #f59e0b, #d97706); color: white; box-shadow: 0 0 10px rgba(245, 158, 11, 0.4); border: none;' };
    } else {
        return { text: '🏆 终极家务战神', style: 'background: rgba(0,255,102,0.15); color: var(--accent-color); border: 1px solid var(--accent-color); box-shadow: var(--accent-glow); text-shadow: 0 0 8px rgba(0,255,102,0.8);' };
    }
}

export const ProfileView = {
    state: {
        profile: null,
        members: [
            { id: 'mock_user_1', name: '爸爸', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=0ea5e9', role: 'admin' },
            { id: 'mock_user_2', name: '妈妈', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ef4444', role: 'member' },
            { id: 'mock_user_3', name: '孩子', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=00ff66', role: 'member' }
        ],
        isAdmin: true, // For mock
        currentFamilyId: 'family_abc123'
    },

    async render() {
        this.state.profile = await getUserProfile();
        
        // Dynamically calculate chores count
        const records = store.getSharedMockRecords();
        const now = new Date();
        const currentMonthChores = records.filter(r => 
            r.memberId === 'mock_user_1' && 
            r.completed_at.getMonth() === now.getMonth() && 
            r.completed_at.getFullYear() === now.getFullYear()
        ).length;
        
        const badge = getBadge(currentMonthChores);
        const roleText = this.state.isAdmin ? '管理员' : '成员';

        return `
            <div class="view-section active" style="position: relative;">
                <!-- User Info Card -->
                <div class="card" style="display: flex; flex-direction: column; align-items: center; padding: 32px 16px;">
                    <img src="${this.state.profile.pictureUrl || 'https://ui-avatars.com/api/?name=U'}" 
                         alt="Avatar" 
                         style="width: 80px; height: 80px; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.5); margin-bottom: 16px; border: 2px solid var(--border-color);">
                    <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">${this.state.profile.displayName || '未知用户'}</h2>
                    
                    <span style="${badge.style} padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 12px; transition: all 0.3s;">
                        ${badge.text} (本月 ${currentMonthChores} 次)
                    </span>
                    
                    <p style="color: var(--text-secondary); font-size: 12px;">梦想家园 (${roleText})</p>
                </div>

                <div style="margin-top: 24px;">
                    <h3 style="font-size: 16px; margin-bottom: 12px; color: var(--text-secondary);">家庭协作</h3>
                    
                    <div class="card" id="btn-invite" style="display: flex; align-items: center; padding: 16px; cursor: pointer; transition: background 0.2s;">
                        <span style="font-size: 20px; margin-right: 16px;">💌</span>
                        <div style="flex: 1;">
                            <h4 style="font-size: 16px; margin-bottom: 2px;">邀请家庭成员</h4>
                            <p style="font-size: 12px; color: var(--text-secondary);">生成专属链接并发送给 LINE 好友</p>
                        </div>
                        <span style="color: var(--text-secondary);">➔</span>
                    </div>
                    
                    <div class="card" id="btn-members" style="display: flex; align-items: center; padding: 16px; cursor: pointer; margin-top: 12px; transition: background 0.2s;">
                        <span style="font-size: 20px; margin-right: 16px;">👥</span>
                        <div style="flex: 1;">
                            <h4 style="font-size: 16px; margin-bottom: 2px;">成员列表与管理</h4>
                            <p style="font-size: 12px; color: var(--text-secondary);">当前共 <span id="member-count">${this.state.members.length}</span> 人</p>
                        </div>
                        <span style="color: var(--text-secondary);">➔</span>
                    </div>
                </div>

                <div style="margin-top: 24px;">
                    <h3 style="font-size: 16px; margin-bottom: 12px; color: var(--text-secondary);">系统与数据</h3>
                    
                    <div class="card" id="btn-photo-wall" style="display: flex; align-items: center; padding: 16px; cursor: pointer; margin-bottom: 12px; transition: background 0.2s;">
                        <span style="font-size: 20px; margin-right: 16px;">🖼️</span>
                        <div style="flex: 1;">
                            <h4 style="font-size: 16px; margin-bottom: 2px;">家务成果墙</h4>
                            <p style="font-size: 12px; color: var(--text-secondary);">回顾大家辛勤劳动的瞬间</p>
                        </div>
                        <span style="color: var(--text-secondary);">➔</span>
                    </div>
                    
                    <div class="card" id="btn-supplies-memo" style="display: flex; align-items: center; padding: 16px; cursor: pointer; margin-bottom: 12px; transition: background 0.2s;">
                        <span style="font-size: 20px; margin-right: 16px;">📋</span>
                        <div style="flex: 1;">
                            <h4 style="font-size: 16px; margin-bottom: 2px;">耗材备忘录</h4>
                            <p style="font-size: 12px; color: var(--text-secondary);">清洁剂该买了？记录在这里</p>
                        </div>
                        <span style="color: var(--text-secondary);">➔</span>
                    </div>

                    <div class="card" style="display: flex; align-items: center; padding: 16px; cursor: pointer; margin-bottom: 12px;">
                        <span style="font-size: 20px; margin-right: 16px;">🔔</span>
                        <div style="flex: 1;">
                            <h4 style="font-size: 16px;">强提醒设置 (21:00)</h4>
                        </div>
                        <span style="color: var(--text-secondary);">➔</span>
                    </div>
                    
                    <div class="card" style="display: flex; align-items: center; padding: 16px; cursor: pointer;">
                        <span style="font-size: 20px; margin-right: 16px;">🎨</span>
                        <div style="flex: 1;">
                            <h4 style="font-size: 16px;">极客主题切换</h4>
                        </div>
                        <div style="width: 40px; height: 24px; background: rgba(0,255,102,0.3); border: 1px solid var(--accent-color); border-radius: 12px; position: relative; box-shadow: var(--accent-glow);">
                            <div style="width: 18px; height: 18px; background: var(--accent-color); border-radius: 50%; position: absolute; top: 2px; right: 2px;"></div>
                        </div>
                    </div>
                </div>

                <!-- Members Drawer -->
                <div id="members-drawer" style="display: none; position: absolute; inset: -20px; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 2000; flex-direction: column; padding: 40px 20px 20px 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <h2 style="font-size: 20px; font-weight: 700; text-shadow: var(--accent-glow); color: var(--accent-color);">家庭成员</h2>
                        <button id="btn-close-members" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">&times;</button>
                    </div>
                    
                    <div id="members-list" style="display: flex; flex-direction: column; gap: 16px; overflow-y: auto;">
                        <!-- JS generated list -->
                    </div>
                </div>

                <!-- Supplies Memo Modal -->
                <div id="supplies-modal" style="display: none; position: absolute; inset: -20px; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 2000; align-items: center; justify-content: center;">
                    <div class="card" style="width: 90%; max-width: 400px; padding: 24px; border: 1px solid var(--accent-color); box-shadow: var(--accent-glow);">
                        <h3 style="margin-bottom: 16px; font-size: 18px; font-weight: 700; color: var(--accent-color);">新建耗材备忘</h3>
                        <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">这将在家庭广场发出强提醒，直到某人买好。</p>
                        <input type="text" id="supplies-input" placeholder="例如：洗衣液、洗洁精、垃圾袋..." style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-primary); padding: 12px; border-radius: var(--radius-sm); font-size: 14px; outline: none; margin-bottom: 20px;">
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button id="btn-cancel-supplies" style="background: transparent; border: none; color: var(--text-secondary); padding: 8px 16px; cursor: pointer;">取消</button>
                            <button id="btn-submit-supplies" class="btn btn-primary" style="padding: 8px 20px;">发布强提醒</button>
                        </div>
                    </div>
                </div>

                <!-- Photo Wall Drawer -->
                <div id="photo-wall-drawer" style="display: none; position: absolute; inset: -20px; background: rgba(0,0,0,0.9); z-index: 2000; flex-direction: column; padding: 40px 20px 20px 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <h2 style="font-size: 20px; font-weight: 700; color: var(--text-primary);">家务成果墙</h2>
                        <button id="btn-close-photo-wall" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">&times;</button>
                    </div>
                    <div id="photo-wall-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; overflow-y: auto; padding-bottom: 20px;">
                        <!-- JS generated photos -->
                    </div>
                </div>

                <!-- Lightbox for Photos -->
                <div id="profile-lightbox" style="display: none; position: absolute; inset: -20px; background: rgba(0,0,0,0.95); z-index: 3000; align-items: center; justify-content: center; cursor: zoom-out;">
                    <img id="profile-lightbox-img" style="max-width: 95%; max-height: 90vh; border-radius: 8px; object-fit: contain; transition: transform 0.2s;">
                </div>
            </div>
        `;
    },

    async mount(container) {
        container.innerHTML = '<div class="loading-screen"><div class="spinner"></div><p>加载中...</p></div>';
        const html = await this.render();
        container.innerHTML = html;
        this.container = container;
        
        this.dom = {
            btnInvite: container.querySelector('#btn-invite'),
            btnMembers: container.querySelector('#btn-members'),
            btnCloseMembers: container.querySelector('#btn-close-members'),
            membersDrawer: container.querySelector('#members-drawer'),
            membersList: container.querySelector('#members-list'),
            memberCountText: container.querySelector('#member-count'),
            
            btnPhotoWall: container.querySelector('#btn-photo-wall'),
            photoWallDrawer: container.querySelector('#photo-wall-drawer'),
            btnClosePhotoWall: container.querySelector('#btn-close-photo-wall'),
            photoWallGrid: container.querySelector('#photo-wall-grid'),
            lightbox: container.querySelector('#profile-lightbox'),
            lightboxImg: container.querySelector('#profile-lightbox-img'),

            btnSuppliesMemo: container.querySelector('#btn-supplies-memo'),
            suppliesModal: container.querySelector('#supplies-modal'),
            btnCancelSupplies: container.querySelector('#btn-cancel-supplies'),
            btnSubmitSupplies: container.querySelector('#btn-submit-supplies'),
            suppliesInput: container.querySelector('#supplies-input')
        };

        // ... existing events ...
        if (this.dom.btnInvite) {
            this.dom.btnInvite.addEventListener('click', async () => {
                try {
                    await shareFamilyInvite(this.state.currentFamilyId, this.state.profile.displayName);
                } catch(e) {
                    console.log("LIFF Share triggered outside LINE app context or cancelled");
                }
            });
        }

        if (this.dom.btnMembers) {
            this.dom.btnMembers.addEventListener('click', () => {
                this.renderMembersList();
                this.dom.membersDrawer.style.display = 'flex';
            });
        }

        if (this.dom.btnCloseMembers) {
            this.dom.btnCloseMembers.addEventListener('click', () => {
                this.dom.membersDrawer.style.display = 'none';
            });
        }

        // --- Photo Wall Events ---
        this.dom.btnPhotoWall.addEventListener('click', () => {
            this.renderPhotoWall();
            this.dom.photoWallDrawer.style.display = 'flex';
        });

        this.dom.btnClosePhotoWall.addEventListener('click', () => {
            this.dom.photoWallDrawer.style.display = 'none';
        });

        this.dom.lightbox.addEventListener('click', () => {
            this.dom.lightbox.style.display = 'none';
        });

        // --- Supplies Memo Events ---
        this.dom.btnSuppliesMemo.addEventListener('click', () => {
            this.dom.suppliesInput.value = '';
            this.dom.suppliesModal.style.display = 'flex';
        });

        this.dom.btnCancelSupplies.addEventListener('click', () => {
            this.dom.suppliesModal.style.display = 'none';
        });

        this.dom.btnSubmitSupplies.addEventListener('click', () => {
            const val = this.dom.suppliesInput.value.trim();
            if (!val) return alert("请输入耗材名称！");
            
            store.addSupplyMemo(val, 'mock_user_1');
            alert(`已发布：${val}\n所有家庭成员的广场上已置顶强提醒！`);
            this.dom.suppliesModal.style.display = 'none';
        });
    },

    renderPhotoWall() {
        const records = store.getSharedMockRecords().filter(r => r.photo_url);
        
        if (records.length === 0) {
            this.dom.photoWallGrid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 40px 0;">暂无家务成果照片</div>`;
            return;
        }

        let html = '';
        records.forEach(r => {
            html += `
                <div class="photo-item" style="position: relative; border-radius: 8px; overflow: hidden; aspect-ratio: 1; cursor: zoom-in;">
                    <img src="${r.photo_url}" data-src="${r.photo_url}" style="width: 100%; height: 100%; object-fit: cover;">
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 12px 8px 8px 8px;">
                        <div style="font-size: 11px; font-weight: bold; color: white;">${r.chore_title}</div>
                        <div style="font-size: 10px; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                            <div class="neon-dot ${r.color}" style="width: 6px; height: 6px;"></div> ${r.completed_by_name}
                        </div>
                    </div>
                </div>
            `;
        });

        this.dom.photoWallGrid.innerHTML = html;

        this.dom.photoWallGrid.querySelectorAll('.photo-item img').forEach(img => {
            img.addEventListener('click', (e) => {
                this.dom.lightboxImg.src = e.target.dataset.src;
                this.dom.lightbox.style.display = 'flex';
            });
        });
    },

    renderMembersList() {
        let html = '';
        this.state.members.forEach(member => {
            const isMe = member.id === 'mock_user_1'; // Mock current user
            const badgeHtml = member.role === 'admin' 
                ? '<span style="background: rgba(255,255,255,0.1); font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">管理员</span>' 
                : '';
                
            let actionHtml = '';
            if (this.state.isAdmin && !isMe) {
                actionHtml = `<button class="btn-kick" data-id="${member.id}" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.5); color: #ef4444; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s;">移除</button>`;
            }

            html += `
                <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${member.avatar}" style="width: 40px; height: 40px; border-radius: 50%; background: #000; border: 1px solid var(--border-color);">
                        <div>
                            <div style="font-size: 14px; font-weight: 600; display: flex; align-items: center;">
                                ${member.name} ${isMe ? '<span style="color: var(--accent-color); font-size: 10px; margin-left: 4px;">(我)</span>' : ''} ${badgeHtml}
                            </div>
                            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">2026-05-10 加入</div>
                        </div>
                    </div>
                    ${actionHtml}
                </div>
            `;
        });

        this.dom.membersList.innerHTML = html;

        // Bind kick events
        this.dom.membersList.querySelectorAll('.btn-kick').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const member = this.state.members.find(m => m.id === id);
                if(confirm(`确定要将 ${member.name} 移出家庭组吗？\n(这将会触发 Firestore arrayRemove 操作)`)) {
                    // Simulate arrayRemove
                    this.state.members = this.state.members.filter(m => m.id !== id);
                    this.dom.memberCountText.textContent = this.state.members.length;
                    this.renderMembersList();
                    console.log("Mock Firestore arrayRemove successful.");
                }
            });
        });
    }
};
