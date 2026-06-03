export const FamilyView = {
    render() {
        return `
            <div class="view-section active">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="font-size: 24px; font-weight: 700;">家庭广场</h2>
                    <span style="background: rgba(0,255,102,0.1); border: 1px solid var(--accent-color); color: var(--accent-color); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; box-shadow: var(--accent-glow);">在线: 2人</span>
                </div>

                <div class="feed-container">
                    <!-- Feed Item -->
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                            <img src="https://ui-avatars.com/api/?name=Papa&background=0D8ABC&color=fff" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--accent-color); box-shadow: var(--accent-glow);" alt="avatar">
                            <div>
                                <h4 style="font-size: 14px; font-weight: 700;">爸爸 (张三)</h4>
                                <p style="color: var(--text-secondary); font-size: 12px;">10 分钟前</p>
                            </div>
                        </div>
                        
                        <p style="font-size: 14px; margin-bottom: 12px;">完成了 <span style="font-weight: bold; color: var(--accent-color); text-shadow: var(--accent-glow);">清理油烟机</span> ✨</p>
                        
                        <div class="mesh-gradient-box" style="width: 100%; height: 160px; border-radius: var(--radius-sm); margin-bottom: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color);">
                            <!-- Placeholder for uploaded photo -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        </div>
                        
                        <div style="display: flex; gap: 16px; border-top: 1px solid var(--border-color); padding-top: 12px;">
                            <button style="background: none; border: none; color: var(--text-secondary); font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 600;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg> 点赞 (2)
                            </button>
                            <button style="background: none; border: none; color: var(--text-secondary); font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 600;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> 评论
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    mount(container) {
        container.innerHTML = this.render();
    }
};
