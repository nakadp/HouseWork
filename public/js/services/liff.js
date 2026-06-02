// LIFF ID for the project
const LIFF_ID = "2010266669-Efem8Y7p";

/**
 * Initialize LIFF SDK
 */
export async function initLIFF() {
    try {
        await liff.init({ liffId: LIFF_ID });
        console.log("LIFF initialized successfully");
        
        // Ensure user is logged in
        if (!liff.isLoggedIn()) {
            // Check if we are running inside Line Client. If not, maybe we shouldn't force login for local dev
            // but for a real app, we need the user profile.
            // liff.login();
            console.warn("User is not logged in to LIFF");
        }
        return true;
    } catch (err) {
        console.error("LIFF initialization failed", err);
        throw err;
    }
}

/**
 * Get User Profile from Line
 * @returns {Promise<{userId: string, displayName: string, pictureUrl: string}>}
 */
export async function getUserProfile() {
    if (!liff.isLoggedIn()) {
        return {
            userId: "mock_user_123",
            displayName: "测试用户",
            pictureUrl: "https://ui-avatars.com/api/?name=User"
        };
    }
    return await liff.getProfile();
}

/**
 * Send an invite message to a friend/group using ShareTargetPicker
 * @param {string} familyId - The ID of the family to invite to
 * @param {string} inviterName - Name of the person sending the invite
 */
export async function shareFamilyInvite(familyId, inviterName) {
    if (!liff.isApiAvailable('shareTargetPicker')) {
        alert('当前环境不支持分享功能，请在 LINE 客户端内使用。');
        return false;
    }

    const appUrl = `https://liff.line.me/${LIFF_ID}?familyId=${familyId}`;
    
    try {
        const result = await liff.shareTargetPicker([
            {
                type: "flex",
                altText: `${inviterName} 邀请你加入家务群组`,
                contents: {
                    type: "bubble",
                    body: {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "text",
                                text: "🏠 家庭邀请",
                                weight: "bold",
                                size: "xl",
                                color: "#0ea5e9"
                            },
                            {
                                type: "text",
                                text: `${inviterName} 邀请你一起管理家务，让生活更轻松！`,
                                margin: "md",
                                wrap: true
                            }
                        ]
                    },
                    footer: {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "button",
                                action: {
                                    type: "uri",
                                    label: "点击加入",
                                    uri: appUrl
                                },
                                style: "primary",
                                color: "#0ea5e9"
                            }
                        ]
                    }
                }
            }
        ]);

        if (result) {
            console.log("Message sent via ShareTargetPicker", result);
            return true;
        } else {
            console.log("ShareTargetPicker was closed without sending");
            return false;
        }
    } catch (error) {
        console.error("Error in ShareTargetPicker", error);
        return false;
    }
}
