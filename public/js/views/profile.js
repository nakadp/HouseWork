import { getUserProfile, shareFamilyInvite } from '../services/liff.js';

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
            { id: '1', name: '爸爸', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=0ea5e9', role: 'admin' },
            { id: '2', name: '妈妈', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ef4444', role: 'member' },
            { id: '3', name: '孩子', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=00ff66', role: 'member' }
        ],
        isAdmin: true, // For mock
        currentFamilyId: 'family_abc123'
    },

    async render() {
        this.state.profile = await getUserProfile();
        // Mock chores count
        const currentMonthChores = Math.floor(Math.random() * 30);
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
                    
                    <div class="card" style="display: flex; align-items: center; padding: 16px; cursor: pointer; margin-bottom: 12px;">
                        <span style="font-size: 20px; margin-right: 16px;">🖼️</span>
                        <div style="flex: 1;">
                            <h4 style="font-size: 16px; margin-bottom: 2px;">家务成果墙</h4>
                            <p style="font-size: 12px; color: var(--text-secondary);">回顾大家辛勤劳动的瞬间</p>
                        </div>
                        <span style="color: var(--text-secondary);">➔</span>
                    </div>
                    
                    <div class="card" style="display: flex; align-items: center; padding: 16px; cursor: pointer; margin-bottom: 12px;">
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
            memberCountText: container.querySelector('#member-count')
        };

        // Invite Event
        if (this.dom.btnInvite) {
            this.dom.btnInvite.addEventListener('click', async () => {
                try {
                    await shareFamilyInvite(this.state.currentFamilyId, this.state.profile.displayName);
                } catch(e) {
                    console.log("LIFF Share triggered outside LINE app context or cancelled");
                }
            });
        }

        // Open Members Drawer
        if (this.dom.btnMembers) {
            this.dom.btnMembers.addEventListener('click', () => {
                this.renderMembersList();
                this.dom.membersDrawer.style.display = 'flex';
            });
        }

        // Close Drawer
        if (this.dom.btnCloseMembers) {
            this.dom.btnCloseMembers.addEventListener('click', () => {
                this.dom.membersDrawer.style.display = 'none';
            });
        }
    },

    renderMembersList() {
        let html = '';
        this.state.members.forEach(member => {
            const isMe = member.id === '1'; // Mock current user
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
