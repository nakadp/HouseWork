export const ChoresView = {
    render() {
        return `
            <div class="view-section active" style="height: 100%; display: flex; flex-direction: column;">
                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">家务库</h2>
                
                <div style="display: flex; flex: 1; gap: 16px; overflow: hidden;">
                    <!-- Left Sidebar (Categories) -->
                    <div style="width: 80px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; scrollbar-width: none;">
                        <div class="category-item active" style="padding: 12px 8px; text-align: center; background: var(--surface-solid); border-radius: var(--radius-sm); font-size: 12px; font-weight: bold; color: var(--primary-color); border-left: 3px solid var(--primary-color);">
                            客厅
                        </div>
                        <div class="category-item" style="padding: 12px 8px; text-align: center; color: var(--text-secondary); font-size: 12px;">
                            厨房
                        </div>
                        <div class="category-item" style="padding: 12px 8px; text-align: center; color: var(--text-secondary); font-size: 12px;">
                            卧室
                        </div>
                        <div class="category-item" style="padding: 12px 8px; text-align: center; color: var(--text-secondary); font-size: 12px;">
                            卫生间
                        </div>
                        <button style="background: none; border: 1px dashed var(--border-color); padding: 12px 8px; border-radius: var(--radius-sm); font-size: 12px; color: var(--text-secondary); cursor: pointer;">
                            + 添加
                        </button>
                    </div>
                    
                    <!-- Right Content (Grid) -->
                    <div style="flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; align-content: start;">
                        <div class="card" style="text-align: center; padding: 16px 8px;">
                            <div style="font-size: 32px; margin-bottom: 8px;">🧹</div>
                            <h4 style="font-size: 14px;">扫地</h4>
                        </div>
                        <div class="card" style="text-align: center; padding: 16px 8px;">
                            <div style="font-size: 32px; margin-bottom: 8px;">🧽</div>
                            <h4 style="font-size: 14px;">拖地</h4>
                        </div>
                        <div class="card" style="text-align: center; padding: 16px 8px;">
                            <div style="font-size: 32px; margin-bottom: 8px;">🪴</div>
                            <h4 style="font-size: 14px;">浇花</h4>
                        </div>
                        <div class="card" style="text-align: center; padding: 16px 8px; background: var(--primary-light); border: 1px dashed var(--primary-color); color: var(--primary-color); display: flex; align-items: center; justify-content: center; min-height: 100px; cursor: pointer;">
                            <h4 style="font-size: 14px;">+ 自定义</h4>
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
