import { store } from '../store.js?v=11';

export const ChoresView = {
    get state() {
        return store.choresLibrary;
    },

    render() {
        return `
            <div class="view-section active" style="height: 100%; display: flex; flex-direction: column; position: relative;">
                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">家务库</h2>
                
                <div style="display: flex; flex: 1; gap: 16px; overflow: hidden;">
                    <!-- Left Sidebar (Categories) -->
                    <div id="sidebar-categories" style="width: 80px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; scrollbar-width: none;">
                        <!-- JS renders categories here -->
                    </div>
                    
                    <!-- Right Content (Grid) -->
                    <div id="grid-chores" style="flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; align-content: start; padding-bottom: 20px; scrollbar-width: none;">
                        <!-- JS renders chores here -->
                    </div>
                </div>

                <!-- Global Modal Overlay -->
                <div id="chore-modal" style="display: none; position: absolute; inset: -20px; background: rgba(0,0,0,0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 2000; align-items: center; justify-content: center;">
                    <div class="card" style="width: 85%; max-width: 340px; border-radius: 24px; padding: 24px; border: 1px solid rgba(0,255,102,0.3); box-shadow: 0 0 30px rgba(0,255,102,0.15);">
                        <h3 id="modal-title" style="margin-bottom: 16px; font-size: 18px; font-weight: 700;">操作</h3>
                        
                        <div id="modal-input-group" style="display: none; margin-bottom: 20px;">
                            <input type="text" id="modal-input" placeholder="输入名称..." style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-primary); padding: 12px 16px; border-radius: var(--radius-sm); font-size: 16px; outline: none; transition: border-color 0.2s;">
                        </div>

                        <div id="modal-action-group" style="display: none; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                            <button id="modal-btn-edit" class="btn" style="background: rgba(255,255,255,0.1); color: var(--text-primary);">修改名称</button>
                            <button id="modal-btn-delete" class="btn" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.5); color: #ef4444; text-shadow: 0 0 8px rgba(239, 68, 68, 0.4);">删除该家务</button>
                        </div>
                        
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button id="modal-btn-cancel" style="background: transparent; border: none; color: var(--text-secondary); font-size: 14px; font-weight: 600; padding: 8px 16px; cursor: pointer;">取消</button>
                            <button id="modal-btn-confirm" class="btn btn-primary" style="padding: 8px 20px; font-size: 14px; display: none;">确认</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    mount(container) {
        container.innerHTML = this.render();
        this.container = container;
        
        this.dom = {
            sidebar: container.querySelector('#sidebar-categories'),
            grid: container.querySelector('#grid-chores'),
            modal: container.querySelector('#chore-modal'),
            modalTitle: container.querySelector('#modal-title'),
            modalInputGroup: container.querySelector('#modal-input-group'),
            modalInput: container.querySelector('#modal-input'),
            modalActionGroup: container.querySelector('#modal-action-group'),
            modalBtnEdit: container.querySelector('#modal-btn-edit'),
            modalBtnDelete: container.querySelector('#modal-btn-delete'),
            modalBtnCancel: container.querySelector('#modal-btn-cancel'),
            modalBtnConfirm: container.querySelector('#modal-btn-confirm')
        };

        this.dom.modalInput.addEventListener('focus', (e) => e.target.style.borderColor = 'var(--accent-color)');
        this.dom.modalInput.addEventListener('blur', (e) => e.target.style.borderColor = 'var(--border-color)');
        this.dom.modalBtnCancel.addEventListener('click', () => this.hideModal());

        this.updateView();
    },

    updateView() {
        this.renderSidebar();
        this.renderGrid();
    },

    renderSidebar() {
        let html = '';
        this.state.categories.forEach(cat => {
            const isActive = cat === this.state.activeCategory;
            if (isActive) {
                html += `
                    <div class="category-item active" data-cat="${cat}" style="padding: 12px 8px; text-align: center; background: var(--surface-solid); border-radius: var(--radius-sm); font-size: 14px; font-weight: bold; color: var(--accent-color); border-left: 3px solid var(--accent-color); text-shadow: var(--accent-glow); box-shadow: inset 20px 0 20px -20px var(--accent-color); cursor: pointer;">
                        ${cat}
                    </div>
                `;
            } else {
                html += `
                    <div class="category-item" data-cat="${cat}" style="padding: 12px 8px; text-align: center; color: var(--text-secondary); font-size: 14px; font-weight: 600; cursor: pointer; transition: color 0.2s;">
                        ${cat}
                    </div>
                `;
            }
        });

        html += `
            <button id="btn-add-category" style="background: none; border: 1px dashed var(--border-color); padding: 12px 8px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; color: var(--text-secondary); cursor: pointer; margin-top: 8px; transition: all 0.2s;">
                + 添加
            </button>
        `;

        this.dom.sidebar.innerHTML = html;

        this.dom.sidebar.querySelectorAll('.category-item').forEach(el => {
            el.addEventListener('click', (e) => {
                this.state.activeCategory = e.currentTarget.dataset.cat;
                this.updateView();
            });
        });

        this.dom.sidebar.querySelector('#btn-add-category').addEventListener('click', () => {
            this.showModal({
                title: '添加新区域',
                type: 'input',
                placeholder: '如：阳台',
                onConfirm: (val) => {
                    if (val && !this.state.categories.includes(val)) {
                        this.state.categories.push(val);
                        this.state.chores[val] = [];
                        this.state.activeCategory = val;
                        this.updateView();
                    }
                }
            });
        });
    },

    renderGrid() {
        const choresList = this.state.chores[this.state.activeCategory] || [];
        let html = '';

        choresList.forEach(chore => {
            html += `
                <div class="card chore-card-item" data-id="${chore.id}" style="text-align: center; padding: 20px 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: transform 0.2s;">
                    ${chore.icon}
                    <h4 style="font-size: 14px; font-weight: 600;">${chore.name}</h4>
                </div>
            `;
        });

        html += `
            <div id="btn-add-chore" class="card" style="text-align: center; padding: 20px 8px; background: rgba(0,255,102,0.05); border: 1px dashed var(--accent-color); color: var(--accent-color); display: flex; align-items: center; justify-content: center; min-height: 110px; cursor: pointer; box-shadow: inset 0 0 20px rgba(0,255,102,0.05);">
                <h4 style="font-size: 14px; font-weight: 700; text-shadow: var(--accent-glow);">+ 自定义</h4>
            </div>
        `;

        this.dom.grid.innerHTML = html;

        this.dom.grid.querySelectorAll('.chore-card-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const chore = choresList.find(c => c.id === id);
                if (chore) {
                    this.showModal({
                        title: `操作: ${chore.name}`,
                        type: 'action',
                        choreId: chore.id,
                        choreName: chore.name
                    });
                }
            });
        });

        this.dom.grid.querySelector('#btn-add-chore').addEventListener('click', () => {
            this.showModal({
                title: `为 ${this.state.activeCategory} 添加家务`,
                type: 'input',
                placeholder: '如：擦桌子',
                onConfirm: (val) => {
                    if (val) {
                        this.state.chores[this.state.activeCategory].push({
                            id: store.choresLibrary.nextId++,
                            name: val,
                            icon: store.genericIcon
                        });
                        this.renderGrid();
                    }
                }
            });
        });
    },

    hideModal() {
        this.dom.modal.style.display = 'none';
        this.dom.modalInput.blur();
    },

    showModal(config) {
        this.dom.modalTitle.textContent = config.title;
        this.dom.modal.style.display = 'flex';
        
        this.dom.modalInputGroup.style.display = 'none';
        this.dom.modalActionGroup.style.display = 'none';
        this.dom.modalBtnConfirm.style.display = 'none';
        this.dom.modalInput.value = '';
        
        this.dom.modalBtnConfirm.onclick = null;
        this.dom.modalBtnEdit.onclick = null;
        this.dom.modalBtnDelete.onclick = null;

        if (config.type === 'input') {
            this.dom.modalInputGroup.style.display = 'block';
            this.dom.modalBtnConfirm.style.display = 'block';
            this.dom.modalInput.value = config.value || '';
            this.dom.modalInput.placeholder = config.placeholder || '';
            this.dom.modalInput.focus();

            this.dom.modalBtnConfirm.onclick = () => {
                if (config.onConfirm) {
                    config.onConfirm(this.dom.modalInput.value.trim());
                }
                this.hideModal();
            };
            
            this.dom.modalInput.onkeyup = (e) => {
                if (e.key === 'Enter') {
                    this.dom.modalBtnConfirm.click();
                }
            };
        } else if (config.type === 'action') {
            this.dom.modalActionGroup.style.display = 'flex';
            this.dom.modalInput.onkeyup = null;
            
            this.dom.modalBtnEdit.onclick = () => {
                this.hideModal();
                setTimeout(() => {
                    this.showModal({
                        title: '修改名称',
                        type: 'input',
                        value: config.choreName,
                        onConfirm: (newVal) => {
                            if (newVal) {
                                const list = this.state.chores[this.state.activeCategory];
                                const chore = list.find(c => c.id === config.choreId);
                                if (chore) chore.name = newVal;
                                this.renderGrid();
                            }
                        }
                    });
                }, 100);
            };

            this.dom.modalBtnDelete.onclick = () => {
                const list = this.state.chores[this.state.activeCategory];
                this.state.chores[this.state.activeCategory] = list.filter(c => c.id !== config.choreId);
                this.renderGrid();
                this.hideModal();
            };
        }
    }
};
