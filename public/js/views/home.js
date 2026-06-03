import { store } from '../store.js?v=17';
import { uploadPhoto, compressImage } from '../services/firebase.js?v=17';
import { getUserProfile } from '../services/liff.js?v=17';

export const HomeView = {
    render() {
        return `
            <div class="view-section active" style="position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h2 style="font-size: 28px; font-weight: 800; background: linear-gradient(90deg, #fff, var(--text-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">早安，Shone</h2>
                        <p style="color: var(--text-secondary); margin-top: 4px; font-size: 14px;">今天也是充满活力的一天！</p>
                    </div>
                    <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; border: 2px solid var(--accent-color); box-shadow: var(--accent-glow);">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=000000" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px;">
                    <h3 style="font-size: 18px; font-weight: 700;">今日家务</h3>
                    <button id="btn-add-plan" style="background: rgba(0,255,102,0.1); border: 1px solid var(--accent-color); color: var(--accent-color); padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; box-shadow: var(--accent-glow); cursor: pointer; transition: all 0.2s;">
                        + 添加计划
                    </button>
                </div>
                
                <div id="chores-list" style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                    <!-- JS renders today chores here -->
                </div>

                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px;">
                    <h3 style="font-size: 18px; font-weight: 700;">计划模板</h3>
                    <button id="btn-add-template" style="background: transparent; border: none; color: var(--text-secondary); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                        + 新建模板
                    </button>
                </div>
                
                <div id="templates-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding-bottom: 24px;">
                    <!-- JS renders templates here -->
                </div>

                <!-- Global Add/Edit Modal (Select Chores from Library) -->
                <div id="home-modal" style="display: none; position: absolute; inset: -20px; background: rgba(0,0,0,0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 2000; align-items: center; justify-content: center;">
                    <div class="card" style="width: 90%; max-width: 400px; max-height: 80vh; border-radius: 24px; padding: 24px; border: 1px solid var(--accent-color); box-shadow: var(--accent-glow); display: flex; flex-direction: column;">
                        <h3 id="hm-title" style="margin-bottom: 16px; font-size: 18px; font-weight: 700;">从家务库添加</h3>
                        
                        <div id="hm-input-group" style="display: none; margin-bottom: 16px;">
                            <input type="text" id="hm-input" placeholder="输入模板名称..." style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-primary); padding: 12px; border-radius: var(--radius-sm); font-size: 14px; outline: none;">
                        </div>

                        <!-- Categorized list for selection -->
                        <div id="hm-library-list" style="overflow-y: auto; flex: 1; margin-bottom: 20px; display: flex; flex-direction: column; gap: 16px; padding-right: 8px;">
                            <!-- JS renders library checkboxes here -->
                        </div>

                        <!-- Action buttons for existing item (Edit/Delete) -->
                        <div id="hm-action-group" style="display: none; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                            <button id="hm-btn-edit" class="btn" style="background: rgba(255,255,255,0.1); color: var(--text-primary);">修改名称</button>
                            <button id="hm-btn-delete" class="btn" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.5); color: #ef4444; text-shadow: 0 0 8px rgba(239, 68, 68, 0.4);">删除</button>
                        </div>

                        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: auto;">
                            <button id="hm-btn-cancel" style="background: transparent; border: none; color: var(--text-secondary); font-size: 14px; font-weight: 600; padding: 8px 16px; cursor: pointer;">取消</button>
                            <button id="hm-btn-confirm" class="btn btn-primary" style="padding: 8px 20px; font-size: 14px;">确认</button>
                        </div>
                    </div>
                </div>
                
                <!-- Hidden file input for photo upload -->
                <input type="file" id="photo-upload-input" accept="image/*" capture="environment" style="display: none;">
            </div>
        `;
    },

    mount(container) {
        container.innerHTML = this.render();
        this.container = container;
        
        this.dom = {
            choresList: container.querySelector('#chores-list'),
            templatesList: container.querySelector('#templates-list'),
            btnAddPlan: container.querySelector('#btn-add-plan'),
            btnAddTemplate: container.querySelector('#btn-add-template'),
            
            modal: container.querySelector('#home-modal'),
            hmTitle: container.querySelector('#hm-title'),
            hmInputGroup: container.querySelector('#hm-input-group'),
            hmInput: container.querySelector('#hm-input'),
            hmLibraryList: container.querySelector('#hm-library-list'),
            hmActionGroup: container.querySelector('#hm-action-group'),
            hmBtnCancel: container.querySelector('#hm-btn-cancel'),
            hmBtnConfirm: container.querySelector('#hm-btn-confirm'),
            hmBtnEdit: container.querySelector('#hm-btn-edit'),
            hmBtnDelete: container.querySelector('#hm-btn-delete'),
            
            photoUploadInput: container.querySelector('#photo-upload-input')
        };

        this.dom.btnAddPlan.addEventListener('click', () => this.openAddPlanModal());
        this.dom.btnAddTemplate.addEventListener('click', () => this.openAddTemplateModal());
        this.dom.hmBtnCancel.addEventListener('click', () => this.hideModal());
        
        this.dom.hmLibraryList.addEventListener('change', (e) => {
            if (e.target.classList.contains('lib-checkbox')) {
                const label = e.target.closest('.lib-label-btn');
                if (e.target.checked) {
                    label.style.background = 'rgba(0,255,102,0.1)';
                    label.style.border = '1px solid var(--accent-color)';
                    label.style.color = 'var(--accent-color)';
                    label.style.textShadow = 'var(--accent-glow)';
                    label.style.boxShadow = 'inset 0 0 10px rgba(0,255,102,0.1)';
                } else {
                    label.style.background = 'rgba(255,255,255,0.05)';
                    label.style.border = '1px solid transparent';
                    label.style.color = 'var(--text-primary)';
                    label.style.textShadow = 'none';
                    label.style.boxShadow = 'none';
                }
            }
        });
        
        this.dom.photoUploadInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file && this.pendingUploadChoreId) {
                const chore = store.todayChores.find(c => c.id === this.pendingUploadChoreId);
                if (!chore) return;
                
                try {
                    // Start loading state
                    const btn = document.querySelector(`.btn-complete[data-id="${this.pendingUploadChoreId}"]`);
                    if (btn) btn.textContent = '上传中...';
                    
                    const profile = await getUserProfile();
                    const familyId = localStorage.getItem('user_family_id') || 'family_abc123';
                    
                    const compressedFile = await compressImage(file);
                    const path = `families/${familyId}/photos/${Date.now()}_${compressedFile.name}`;
                    const photoUrl = await uploadPhoto(compressedFile, path);
                    
                    alert('照片上传成功！');
                    chore.isCompleted = true;
                    await store.addSharedMockRecord(chore, profile.userId, true, photoUrl, profile);
                    this.renderChores();
                } catch (error) {
                    console.error("Photo upload failed:", error);
                    alert("照片上传失败：" + error.message);
                } finally {
                    this.pendingUploadChoreId = null;
                }
            }
        });

        this.updateView();
    },

    updateView() {
        this.renderChores();
        this.renderTemplates();
    },

    renderChores() {
        this.dom.choresList.innerHTML = '';
        if (store.todayChores.length === 0) {
            this.dom.choresList.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 20px;">今日任务已全部清空</div>`;
            return;
        }

        store.todayChores.forEach(chore => {
            const libraryChore = store.getLibraryChore(chore.baseId);
            const iconSvg = libraryChore ? libraryChore.icon : store.genericIcon;
            
            let cardStyle = 'animation: fadeIn 0.3s ease; transition: opacity 0.3s; cursor: pointer;';
            let titleStyle = 'font-size: 18px; font-weight: 700; color: var(--text-primary); transition: color 0.3s;';
            let btnHtml = `<button class="btn btn-primary btn-complete" data-id="${chore.id}" style="padding: 10px 20px; font-size: 14px;">完成</button>`;
            let opacity = '1';

            if (chore.isCompleted) {
                cardStyle += ' border-color: rgba(255,255,255,0.05); background: rgba(0,0,0,0.3); box-shadow: none;';
                titleStyle = 'font-size: 18px; font-weight: 700; color: var(--text-secondary); text-decoration: line-through;';
                btnHtml = `<span style="color: var(--accent-color); font-size: 14px; font-weight: 600; padding: 10px 10px;">已完成 ✓</span>`;
                opacity = '0.5';
            }

            const el = document.createElement('div');
            el.className = 'card chore-card';
            el.style.cssText = cardStyle;
            el.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; opacity: ${opacity};">
                    <div class="chore-info" data-id="${chore.id}" style="display: flex; align-items: center; gap: 16px; flex: 1;">
                        <div style="font-size: 24px; color: ${chore.isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)'};">
                            ${iconSvg}
                        </div>
                        <div>
                            <h3 style="${titleStyle}">${chore.name}</h3>
                            <p style="color: var(--text-secondary); font-size: 12px; margin-top: 2px;">${chore.category}</p>
                        </div>
                    </div>
                    ${btnHtml}
                </div>
            `;
            this.dom.choresList.appendChild(el);
        });

        // Bind clicks
        this.dom.choresList.querySelectorAll('.btn-complete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(e.currentTarget.dataset.id);
                this.pendingUploadChoreId = id;
                if (confirm('是否需要拍摄现场照片作为完成证明？')) {
                    this.dom.photoUploadInput.click();
                } else {
                    const chore = store.todayChores.find(c => c.id === id);
                    if (chore) {
                        chore.isCompleted = true;
                        getUserProfile().then(profile => {
                            store.addSharedMockRecord(chore, profile.userId, false, null, profile);
                        });
                        this.renderChores();
                    }
                }
            });
        });

        this.dom.choresList.querySelectorAll('.chore-info').forEach(info => {
            info.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const chore = store.todayChores.find(c => c.id === id);
                if (chore) {
                    this.openChoreActionModal(chore);
                }
            });
        });
    },

    renderTemplates() {
        this.dom.templatesList.innerHTML = '';
        store.planTemplates.forEach(tpl => {
            const el = document.createElement('div');
            el.className = 'card';
            el.style.cssText = 'padding: 16px; display: flex; flex-direction: column; gap: 8px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; position: relative;';
            el.innerHTML = `
                <div class="tpl-edit" data-id="${tpl.id}" style="position: absolute; top: 12px; right: 12px; color: var(--text-secondary); padding: 4px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
                <h4 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-right: 20px;">${tpl.name}</h4>
                <p style="color: var(--text-secondary); font-size: 12px;">包含 ${tpl.chores.length} 项家务</p>
                <div style="margin-top: 8px; font-size: 12px; font-weight: 600; color: var(--accent-color);">
                    应用模板 +
                </div>
            `;
            
            // Appply template
            el.addEventListener('click', (e) => {
                if(e.target.closest('.tpl-edit')) return;
                
                tpl.chores.forEach(baseId => {
                    const libChore = store.getLibraryChore(baseId);
                    if (libChore) {
                        store.todayChores.push({
                            id: store.nextTodayId++,
                            baseId: libChore.id,
                            name: libChore.name,
                            category: libChore.category,
                            isCompleted: false
                        });
                    }
                });
                this.renderChores();
                
                el.style.transform = 'scale(0.95)';
                el.style.boxShadow = 'var(--accent-glow)';
                setTimeout(() => {
                    el.style.transform = 'scale(1)';
                    el.style.boxShadow = 'none';
                }, 200);
            });

            this.dom.templatesList.appendChild(el);
        });

        this.dom.templatesList.querySelectorAll('.tpl-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(e.currentTarget.dataset.id);
                const tpl = store.planTemplates.find(t => t.id === id);
                if (tpl) {
                    this.openTemplateActionModal(tpl);
                }
            });
        });
    },

    hideModal() {
        this.dom.modal.style.display = 'none';
    },

    // Generates the checkbox list for selecting chores from the library
    generateLibraryCheckboxes(selectedBaseIds = []) {
        let html = '';
        for (let cat in store.choresLibrary.chores) {
            const chores = store.choresLibrary.chores[cat];
            if (chores.length === 0) continue;
            
            html += `<div style="margin-bottom: 12px;"><h4 style="font-size: 14px; color: var(--accent-color); margin-bottom: 8px;">${cat}</h4>`;
            html += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">`;
            chores.forEach(c => {
                const isSelected = selectedBaseIds.includes(c.id);
                const checkedAttr = isSelected ? 'checked' : '';
                const baseStyle = 'display: flex; align-items: center; justify-content: center; padding: 12px 8px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: center;';
                const activeStyle = 'background: rgba(0,255,102,0.1); border: 1px solid var(--accent-color); color: var(--accent-color); text-shadow: var(--accent-glow); box-shadow: inset 0 0 10px rgba(0,255,102,0.1);';
                const inactiveStyle = 'background: rgba(255,255,255,0.05); border: 1px solid transparent; color: var(--text-primary);';
                const currentStyle = isSelected ? `${baseStyle} ${activeStyle}` : `${baseStyle} ${inactiveStyle}`;
                
                html += `
                    <label class="lib-label-btn" style="${currentStyle}">
                        <input type="checkbox" class="lib-checkbox" value="${c.id}" ${checkedAttr} style="display: none;">
                        ${c.name}
                    </label>
                `;
            });
            html += `</div></div>`;
        }
        return html;
    },

    openAddPlanModal() {
        this.dom.hmTitle.textContent = '选择要添加的计划';
        this.dom.modal.style.display = 'flex';
        this.dom.hmInputGroup.style.display = 'none';
        this.dom.hmActionGroup.style.display = 'none';
        this.dom.hmLibraryList.style.display = 'block';
        this.dom.hmBtnConfirm.style.display = 'block';

        this.dom.hmLibraryList.innerHTML = this.generateLibraryCheckboxes([]);

        this.dom.hmBtnConfirm.onclick = () => {
            const checkboxes = this.dom.hmLibraryList.querySelectorAll('.lib-checkbox:checked');
            checkboxes.forEach(cb => {
                const baseId = parseInt(cb.value);
                const libChore = store.getLibraryChore(baseId);
                if (libChore) {
                    store.todayChores.push({
                        id: store.nextTodayId++,
                        baseId: libChore.id,
                        name: libChore.name,
                        category: libChore.category,
                        isCompleted: false
                    });
                }
            });
            this.renderChores();
            this.hideModal();
        };
    },

    openAddTemplateModal() {
        this.dom.hmTitle.textContent = '新建计划模板';
        this.dom.modal.style.display = 'flex';
        this.dom.hmInputGroup.style.display = 'block';
        this.dom.hmInput.value = '';
        this.dom.hmInput.placeholder = '输入模板名称 (如: 年终大扫除)';
        this.dom.hmActionGroup.style.display = 'none';
        this.dom.hmLibraryList.style.display = 'block';
        this.dom.hmBtnConfirm.style.display = 'block';

        this.dom.hmLibraryList.innerHTML = this.generateLibraryCheckboxes([]);

        this.dom.hmBtnConfirm.onclick = () => {
            const name = this.dom.hmInput.value.trim();
            if (!name) return alert('请输入模板名称');
            
            const checkboxes = this.dom.hmLibraryList.querySelectorAll('.lib-checkbox:checked');
            const chores = Array.from(checkboxes).map(cb => parseInt(cb.value));
            
            store.planTemplates.push({
                id: store.nextTemplateId++,
                name: name,
                chores: chores,
                duration: '--'
            });
            
            this.renderTemplates();
            this.hideModal();
        };
    },

    openTemplateActionModal(tpl) {
        this.dom.hmTitle.textContent = `操作模板: ${tpl.name}`;
        this.dom.modal.style.display = 'flex';
        this.dom.hmInputGroup.style.display = 'none';
        this.dom.hmLibraryList.style.display = 'none';
        this.dom.hmActionGroup.style.display = 'flex';
        this.dom.hmBtnConfirm.style.display = 'none';

        this.dom.hmBtnEdit.onclick = () => {
            // switch to edit mode
            this.dom.hmTitle.textContent = `编辑模板: ${tpl.name}`;
            this.dom.hmActionGroup.style.display = 'none';
            this.dom.hmInputGroup.style.display = 'block';
            this.dom.hmInput.value = tpl.name;
            this.dom.hmLibraryList.style.display = 'block';
            this.dom.hmLibraryList.innerHTML = this.generateLibraryCheckboxes(tpl.chores);
            this.dom.hmBtnConfirm.style.display = 'block';

            this.dom.hmBtnConfirm.onclick = () => {
                const name = this.dom.hmInput.value.trim();
                if (!name) return alert('请输入模板名称');
                
                const checkboxes = this.dom.hmLibraryList.querySelectorAll('.lib-checkbox:checked');
                tpl.chores = Array.from(checkboxes).map(cb => parseInt(cb.value));
                tpl.name = name;
                
                this.renderTemplates();
                this.hideModal();
            };
        };

        this.dom.hmBtnDelete.onclick = () => {
            store.planTemplates = store.planTemplates.filter(t => t.id !== tpl.id);
            this.renderTemplates();
            this.hideModal();
        };
    },

    openChoreActionModal(chore) {
        this.dom.hmTitle.textContent = `操作: ${chore.name}`;
        this.dom.modal.style.display = 'flex';
        this.dom.hmInputGroup.style.display = 'none';
        this.dom.hmLibraryList.style.display = 'none';
        this.dom.hmActionGroup.style.display = 'flex';
        this.dom.hmBtnConfirm.style.display = 'none';

        this.dom.hmBtnEdit.onclick = () => {
            this.dom.hmTitle.textContent = `修改名称`;
            this.dom.hmActionGroup.style.display = 'none';
            this.dom.hmInputGroup.style.display = 'block';
            this.dom.hmInput.value = chore.name;
            this.dom.hmBtnConfirm.style.display = 'block';

            this.dom.hmBtnConfirm.onclick = () => {
                const name = this.dom.hmInput.value.trim();
                if (name) {
                    chore.name = name;
                    this.renderChores();
                }
                this.hideModal();
            };
        };

        this.dom.hmBtnDelete.onclick = () => {
            store.todayChores = store.todayChores.filter(c => c.id !== chore.id);
            this.renderChores();
            this.hideModal();
        };
    }
};
