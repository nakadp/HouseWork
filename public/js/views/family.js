export const FamilyView = {
    render() {
        return `
            <div class="view-section active">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="font-size: 24px; font-weight: 700;">家庭广场</h2>
                    <span style="background: var(--primary-light); color: var(--primary-color); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">在线: 2人</span>
                </div>

                <div class="feed-container">
                    <!-- Feed Item -->
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                            <img src="https://ui-avatars.com/api/?name=Papa&background=0D8ABC&color=fff" style="width: 40px; height: 40px; border-radius: 50%;" alt="avatar">
                            <div>
                                <h4 style="font-size: 14px;">爸爸 (张三)</h4>
                                <p style="color: var(--text-secondary); font-size: 12px;">10 分钟前</p>
                            </div>
                        </div>
                        
                        <p style="font-size: 14px; margin-bottom: 12px;">完成了 <span style="font-weight: bold; color: var(--primary-color);">清理油烟机</span> ✨</p>
                        
                        <div style="width: 100%; height: 160px; background: #e2e8f0; border-radius: var(--radius-sm); margin-bottom: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <!-- Placeholder for uploaded photo -->
                            <span style="color: var(--text-secondary);">[照片缩略图]</span>
                        </div>
                        
                        <div style="display: flex; gap: 16px; border-top: 1px solid var(--border-color); padding-top: 12px;">
                            <button style="background: none; border: none; color: var(--text-secondary); font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                                👍 点赞 (2)
                            </button>
                            <button style="background: none; border: none; color: var(--text-secondary); font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                                💬 评论
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
