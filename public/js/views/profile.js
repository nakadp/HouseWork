import { getUserProfile, shareFamilyInvite } from '../services/liff.js';

export const ProfileView = {
    async render() {
        // Fetch user data
        const profile = await getUserProfile();
        
        return `
            <div class="view-section active">
                <!-- User Info Card -->
                <div class="card" style="display: flex; flex-direction: column; align-items: center; padding: 32px 16px;">
                    <img src="${profile.pictureUrl || 'https://ui-avatars.com/api/?name=U'}" 
                         alt="Avatar" 
                         style="width: 80px; height: 80px; border-radius: 50%; box-shadow: var(--shadow-sm); margin-bottom: 16px;">
                    <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">${profile.displayName || '未知用户'}</h2>
                    <span style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 8px;">👑 家务小能手</span>
                    <p style="color: var(--text-secondary); font-size: 12px;">张三的家 (管理员)</p>
                </div>

                <div style="margin-top: 24px;">
                    <h3 style="font-size: 16px; margin-bottom: 12px; color: var(--text-secondary);">家庭管理</h3>
                    
                    <div class="card" id="btn-invite" style="display: flex; align-items: center; padding: 16px; cursor: pointer;">
                        <span style="font-size: 20px; margin-right: 16px;">💌</span>
                        <div style="flex: 1;">
                            <h4 style="font-size: 16px; margin-bottom: 2px;">邀请家庭成员</h4>
                            <p style="font-size: 12px; color: var(--text-secondary);">生成专属链接并发送给 LINE 好友</p>
                        </div>
                        <span style="color: var(--text-secondary);">➔</span>
                    </div>
                    
                    <div class="card" style="display: flex; align-items: center; padding: 16px; cursor: pointer;">
                        <span style="font-size: 20px; margin-right: 16px;">👥</span>
                        <div style="flex: 1;">
                            <h4 style="font-size: 16px; margin-bottom: 2px;">成员列表</h4>
                            <p style="font-size: 12px; color: var(--text-secondary);">当前共 3 人</p>
                        </div>
                        <span style="color: var(--text-secondary);">➔</span>
                    </div>
                </div>

                <div style="margin-top: 24px;">
                    <h3 style="font-size: 16px; margin-bottom: 12px; color: var(--text-secondary);">系统设置</h3>
                    
                    <div class="card" style="display: flex; align-items: center; padding: 16px; cursor: pointer;">
                        <span style="font-size: 20px; margin-right: 16px;">🔔</span>
                        <div style="flex: 1;">
                            <h4 style="font-size: 16px;">提醒设置</h4>
                        </div>
                        <span style="color: var(--text-secondary);">➔</span>
                    </div>
                    
                    <div class="card" style="display: flex; align-items: center; padding: 16px; cursor: pointer;">
                        <span style="font-size: 20px; margin-right: 16px;">🎨</span>
                        <div style="flex: 1;">
                            <h4 style="font-size: 16px;">深色模式</h4>
                        </div>
                        <!-- Toggle switch fake UI -->
                        <div style="width: 40px; height: 24px; background: var(--text-secondary); border-radius: 12px; position: relative;">
                            <div style="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async mount(container) {
        // Show loading temporarily
        container.innerHTML = '<div class="loading-screen"><div class="spinner"></div><p>加载中...</p></div>';
        
        // Render content
        const html = await this.render();
        container.innerHTML = html;
        
        // Attach events
        const btnInvite = container.querySelector('#btn-invite');
        if (btnInvite) {
            btnInvite.addEventListener('click', async () => {
                const profile = await getUserProfile();
                // In a real app, you would fetch the current user's familyId from Firestore
                const mockFamilyId = "family_abc123"; 
                await shareFamilyInvite(mockFamilyId, profile.displayName);
            });
        }
    }
};
