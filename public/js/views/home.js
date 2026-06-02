export const HomeView = {
    render() {
        return `
            <div class="view-section active">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h2 style="font-size: 24px; font-weight: 700;">今日家务</h2>
                        <p style="color: var(--text-secondary); font-size: 14px;">第 3 次打扫 | 预计耗时 30 分钟</p>
                    </div>
                </div>

                <!-- Today's Chores List -->
                <div id="today-chores-list">
                    <div class="card chore-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="font-size: 24px; background: var(--primary-light); padding: 12px; border-radius: var(--radius-sm);">🍽️</div>
                                <div>
                                    <h3 style="font-size: 16px;">洗碗</h3>
                                    <p style="color: var(--text-secondary); font-size: 12px;">厨房</p>
                                </div>
                            </div>
                            <button class="btn btn-primary" id="btn-complete-chore" style="padding: 8px 16px; font-size: 14px;">完成</button>
                        </div>
                    </div>
                    
                    <div class="card chore-card" style="opacity: 0.6;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="font-size: 24px; background: #e2e8f0; padding: 12px; border-radius: var(--radius-sm);">🧹</div>
                                <div>
                                    <h3 style="font-size: 16px; text-decoration: line-through;">扫地</h3>
                                    <p style="color: var(--text-secondary); font-size: 12px;">客厅</p>
                                </div>
                            </div>
                            <span style="color: var(--success-color); font-weight: bold;">已完成 ✓</span>
                        </div>
                    </div>
                </div>

                <h3 style="margin-top: 32px; margin-bottom: 16px; font-size: 18px;">家务计划模板</h3>
                <div style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px; scrollbar-width: none;">
                    <div class="card" style="min-width: 140px; background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white;">
                        <h4 style="margin-bottom: 8px;">周末大扫除</h4>
                        <p style="font-size: 12px; opacity: 0.9;">10 项 | 120 分钟</p>
                    </div>
                    <div class="card" style="min-width: 140px; background: linear-gradient(135deg, #10b981, #059669); color: white;">
                        <h4 style="margin-bottom: 8px;">十分钟快速</h4>
                        <p style="font-size: 12px; opacity: 0.9;">3 项 | 10 分钟</p>
                    </div>
                </div>
                
                <!-- Hidden file input for camera/photo -->
                <input type="file" id="photo-upload" accept="image/*" capture="environment" style="display: none;">
            </div>
        `;
    },

    mount(container) {
        container.innerHTML = this.render();
        
        const btnComplete = container.querySelector('#btn-complete-chore');
        const fileInput = container.querySelector('#photo-upload');

        if (btnComplete && fileInput) {
            btnComplete.addEventListener('click', () => {
                if (confirm('是否上传照片记录完成情况？')) {
                    fileInput.click();
                } else {
                    // Logic to mark as done without photo
                    alert('已标记为完成！');
                }
            });

            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Show some loading state
                    const originalText = btnComplete.textContent;
                    btnComplete.textContent = '上传中...';
                    btnComplete.disabled = true;
                    
                    try {
                        // Dynamically import firebase service to avoid circular dependencies if any
                        const { compressImage } = await import('../services/firebase.js');
                        const compressed = await compressImage(file);
                        console.log(`Ready to upload: ${compressed.name}`);
                        
                        // Mock upload delay
                        setTimeout(() => {
                            alert('照片上传成功，已通知家人！');
                            btnComplete.textContent = '已完成 ✓';
                            btnComplete.style.background = 'var(--success-color)';
                        }, 1000);
                        
                    } catch (err) {
                        console.error(err);
                        alert('上传失败');
                        btnComplete.textContent = originalText;
                        btnComplete.disabled = false;
                    }
                }
            });
        }
    }
};
