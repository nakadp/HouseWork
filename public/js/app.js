import { initLIFF } from './services/liff.js?v=3';
import { initFirebase } from './services/firebase.js?v=3';

// Import Views
import { HomeView } from './views/home.js?v=3';
import { FamilyView } from './views/family.js?v=3';
import { ChoresView } from './views/chores.js?v=3';
import { HistoryView } from './views/history.js?v=3';
import { ProfileView } from './views/profile.js?v=3';

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
            const invitedFamilyId = urlParams.get('familyId');
            if (invitedFamilyId) {
                // Handle invite logic here in the future
                console.log(`User invited to family: ${invitedFamilyId}`);
                alert('检测到家庭邀请，正在为您加入...');
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
