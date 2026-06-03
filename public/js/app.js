import { initLIFF } from './services/liff.js?v=4';
import { initFirebase } from './services/firebase.js?v=4';

// Import Views
import { HomeView } from './views/home.js?v=4';
import { FamilyView } from './views/family.js?v=4';
import { ChoresView } from './views/chores.js?v=4';
import { HistoryView } from './views/history.js?v=4';
import { ProfileView } from './views/profile.js?v=4';

class App {
    constructor() {
        this.currentView = null;
        this.navItems = document.querySelectorAll('.nav-item');
        this.viewContainer = document.getElementById('view-container');
        
        // View registry
        this.views = {
            'home': HomeView,
            'family': FamilyView,
            'chores': ChoresView,
            'history': HistoryView,
            'profile': ProfileView
        };
        
        this.init();
    }

    async init() {
        this.setupNavigation();
        
        try {
            // Initialize LIFF and Firebase concurrently for speed
            await Promise.all([
                initLIFF(),
                initFirebase()
            ]);
            
            // Wait for URL params to handle incoming invites
            const urlParams = new URLSearchParams(window.location.search);
            const action = urlParams.get('action');
            const invitedFamilyId = urlParams.get('familyId');
            const inviter = urlParams.get('inviter') || '好友';

            if (action === 'join' && invitedFamilyId) {
                // Show Glassmorphism Modal
                const modalHtml = `
                    <div id="join-modal" style="position: fixed; inset: -20px; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                        <div class="card" style="width: 85%; max-width: 320px; padding: 32px 24px; text-align: center; border: 1px solid var(--accent-color); box-shadow: var(--accent-glow);">
                            <div style="font-size: 40px; margin-bottom: 16px;">💌</div>
                            <h3 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">家庭组邀请</h3>
                            <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.5;">收到来自 <strong>${decodeURIComponent(inviter)}</strong> 的邀请，是否加入该家庭并同步家务数据？</p>
                            
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <button id="btn-accept-join" class="btn btn-primary" style="padding: 12px;">确认加入</button>
                                <button id="btn-cancel-join" class="btn" style="padding: 12px; background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 1px solid transparent;">暂不加入</button>
                            </div>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                
                document.getElementById('btn-accept-join').addEventListener('click', async () => {
                    document.getElementById('btn-accept-join').textContent = '正在加入...';
                    try {
                        // Mock Firestore arrayUnion fallback
                        localStorage.setItem('user_family_id', invitedFamilyId);
                        console.log("Mock Firestore arrayUnion successful.");
                        
                        const successHtml = `<div style="color: var(--accent-color); font-size: 18px; font-weight: bold; margin-top: 16px;">✓ 加入成功！</div>`;
                        document.getElementById('btn-accept-join').outerHTML = successHtml;
                        document.getElementById('btn-cancel-join').style.display = 'none';
                        
                        setTimeout(() => {
                            window.location.href = window.location.pathname; // Clean URL
                        }, 1500);
                    } catch (e) {
                        alert('加入失败: ' + e.message);
                    }
                });

                document.getElementById('btn-cancel-join').addEventListener('click', () => {
                    document.getElementById('join-modal').remove();
                    window.location.href = window.location.pathname; // Clean URL
                });
                
                return; // Wait for modal action
            }
            
            // Switch to default view
            this.switchView('home');
        } catch (error) {
            console.error('App initialization failed:', error);
            this.viewContainer.innerHTML = `
                <div class="card" style="margin-top: 50px; text-align: center;">
                    <h2 style="color:var(--danger-color); margin-bottom: 16px;">初始化失败</h2>
                    <p style="margin-bottom: 16px; font-size: 14px;">如果您在本地直接打开文件，由于安全性限制（CORS / ES Modules），模块化脚本可能无法正常工作。请确保通过本地服务器访问，或将其部署到 Firebase Hosting。</p>
                    <p style="font-size: 12px; color: var(--text-secondary);">${error.message}</p>
                </div>`;
        }
    }

    setupNavigation() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('data-target');
                if (target !== this.currentView) {
                    this.switchView(target);
                }
            });
        });
    }

    async switchView(viewName) {
        // Update nav UI
        this.navItems.forEach(item => {
            if (item.getAttribute('data-target') === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        this.currentView = viewName;
        
        const ViewModule = this.views[viewName];
        if (ViewModule) {
            // Clear container and mount new view
            this.viewContainer.innerHTML = '';
            
            // Some views might be async (like profile)
            if (ViewModule.mount.constructor.name === 'AsyncFunction') {
                await ViewModule.mount(this.viewContainer);
            } else {
                ViewModule.mount(this.viewContainer);
            }
        } else {
            this.viewContainer.innerHTML = `<p>404 - View Not Found</p>`;
        }
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
