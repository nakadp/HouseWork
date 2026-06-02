export const HistoryView = {
    render() {
        return `
            <div class="view-section active">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="font-size: 24px; font-weight: 700;">历史与统计</h2>
                    <select style="padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--surface-solid);">
                        <option>本月</option>
                        <option>上个月</option>
                    </select>
                </div>

                <div class="card" style="padding: 0; overflow: hidden;">
                    <!-- Simple Calendar Placeholder -->
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 12px; font-weight: bold; padding: 12px 0; background: var(--surface-color); border-bottom: 1px solid var(--border-color);">
                        <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border-color);">
                        <!-- Fake days -->
                        <div style="background: var(--surface-solid); min-height: 60px; padding: 4px;"></div>
                        <div style="background: var(--surface-solid); min-height: 60px; padding: 4px;">1</div>
                        <div style="background: var(--surface-solid); min-height: 60px; padding: 4px;">2
                            <div style="height: 4px; background: var(--primary-color); border-radius: 2px; margin-top: 4px;"></div>
                        </div>
                        <div style="background: var(--surface-solid); min-height: 60px; padding: 4px;">3</div>
                        <div style="background: var(--surface-solid); min-height: 60px; padding: 4px;">4
                            <div style="height: 4px; background: var(--success-color); border-radius: 2px; margin-top: 4px;"></div>
                        </div>
                        <div style="background: var(--surface-solid); min-height: 60px; padding: 4px; background: var(--primary-light); font-weight: bold;">5
                            <div style="height: 4px; background: var(--danger-color); border-radius: 2px; margin-top: 4px;"></div>
                            <div style="height: 4px; background: var(--primary-color); border-radius: 2px; margin-top: 2px;"></div>
                        </div>
                        <div style="background: var(--surface-solid); min-height: 60px; padding: 4px;">6</div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 12px; margin-top: 16px; font-size: 12px; justify-content: center;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <div style="width: 12px; height: 12px; background: var(--primary-color); border-radius: 2px;"></div> 爸爸
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <div style="width: 12px; height: 12px; background: var(--danger-color); border-radius: 2px;"></div> 妈妈
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <div style="width: 12px; height: 12px; background: var(--success-color); border-radius: 2px;"></div> 孩子
                    </div>
                </div>

                <h3 style="margin-top: 32px; margin-bottom: 16px; font-size: 18px;">6月5日 详情</h3>
                <div class="card">
                    <p style="font-size: 14px;">爸爸 - 洗碗 (已完成)</p>
                    <p style="font-size: 14px; margin-top: 8px;">妈妈 - 擦桌子 (已完成)</p>
                </div>
            </div>
        `;
    },

    mount(container) {
        container.innerHTML = this.render();
    }
};
