const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

// 优化1：设置全局选项
setGlobalOptions({ maxInstances: 10, region: "asia-northeast1" });

// 监听数据库路径：当 families/{familyId}/records/ 下有新的家务打卡记录创建时触发
exports.sendLineNotification = onDocumentCreated({
    document: "families/{familyId}/records/{recordId}",
    secrets: ["LINE_CHANNEL_ACCESS_TOKEN"] // 注入您刚刚配置的 Token
}, async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    
    // 获取刚刚写入的家务数据和路径参数
    const record = snapshot.data();
    const familyId = event.params.familyId;
    
    let targetUsers = [];

    // 优化：动态获取家庭成员列表，实现批量推送 (Multicast)
    try {
        const familyDoc = await admin.firestore().collection('families').doc(familyId).get();
        if (familyDoc.exists && Array.isArray(familyDoc.data().members)) {
            const allMembers = familyDoc.data().members;
            
            // 过滤掉当前执行家务的人（自己做完家务不需要再被机器人通知一遍）
            // 假设 record.completed_by 存储的是执行者的 Line User ID
            targetUsers = allMembers.filter(uid => uid !== record.completed_by);
            
            // 如果你想让所有人（包括执行者自己）都收到通知，请将上面一行删掉，改为：
            // targetUsers = allMembers;
        }
    } catch (e) {
        logger.error("读取 family 信息失败", e);
    }

    if (targetUsers.length === 0) {
        logger.info("没有需要通知的其他家庭成员（或成员列表为空），本次跳过发送。");
        return;
    }

    // 组装更优雅的推送文本
    const messageText = 
`🌟 【家务打卡成功】

✨ 项目：${record.chore_title || '家务打卡'}
📍 区域：${record.area || '未指定区域'}
⏰ 时间：${new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Tokyo'})}
👤 执行者：${record.completed_by_name || '某位家庭成员'}

辛苦啦！家里又变得更整洁了！🎉`;

    try {
        // 使用 LINE 的 Multicast API 批量发送给多个用户
        const response = await fetch("https://api.line.me/v2/bot/message/multicast", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                to: targetUsers, // 这是一个数组：["U123...", "U456..."]
                messages: [
                    {
                        type: "text",
                        text: messageText
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            logger.error(`LINE API Multicast 发送失败 (状态码 ${response.status}):`, errorText);
        } else {
            logger.info(`LINE 自动通知已成功推送给 ${targetUsers.length} 位同居者/家人！`);
        }
    } catch (error) {
        logger.error("网络请求发生错误:", error);
    }
});

// 监听数据库路径：当家务记录更新时（主要监听点赞数变化）
exports.sendLikeNotification = onDocumentUpdated({
    document: "families/{familyId}/records/{recordId}",
    secrets: ["LINE_CHANNEL_ACCESS_TOKEN"]
}, async (event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    if (!beforeData || !afterData) return;

    const beforeLikes = beforeData.likes || [];
    const afterLikes = afterData.likes || [];

    // 如果点赞数没有增加，跳过
    if (afterLikes.length <= beforeLikes.length) return;

    // 找到新点赞的用户
    const newLikerIds = afterLikes.filter(uid => !beforeLikes.includes(uid));
    if (newLikerIds.length === 0) return;

    // 只需要通知这个家务的发布者
    const creatorId = afterData.completed_by;
    // 如果是自己点赞自己，就不通知了
    if (newLikerIds.includes(creatorId)) return;

    // 因为我们这里没有关联 Users 集合来获取点赞者的名字，所以通用提示即可
    const messageText = 
`❤️ 【家务被点赞】

您完成的家务 [${afterData.chore_title || '某项家务'}] 收到了家人的点赞！
快去家庭广场看看吧~`;

    try {
        const response = await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                to: creatorId,
                messages: [{ type: "text", text: messageText }]
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            logger.error(`LINE API Like 发送失败:`, errorText);
        } else {
            logger.info(`点赞通知已成功推送给家务创建者: ${creatorId}`);
        }
    } catch (error) {
        logger.error("点赞推送网络错误:", error);
    }
});

// 监听数据库路径：当有新评论创建时
exports.sendCommentNotification = onDocumentCreated({
    document: "families/{familyId}/records/{recordId}/comments/{commentId}",
    secrets: ["LINE_CHANNEL_ACCESS_TOKEN"]
}, async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const comment = snapshot.data();
    const familyId = event.params.familyId;
    const recordId = event.params.recordId;

    try {
        // 获取这条家务本身的信息
        const recordDoc = await admin.firestore().collection('families').doc(familyId).collection('records').doc(recordId).get();
        if (!recordDoc.exists) return;
        const recordData = recordDoc.data();

        // 仅通知发家务的人，且排除自己给自己评论
        const creatorId = recordData.completed_by;
        if (creatorId === comment.author_id) return;

        const messageText = 
`💬 【新评论通知】

${comment.author_name || '家人'} 评论了您的家务 [${recordData.chore_title || '某项家务'}]:
"${comment.content}"

快去家庭广场回复吧~`;

        const response = await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                to: creatorId,
                messages: [{ type: "text", text: messageText }]
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            logger.error(`LINE API Comment 发送失败:`, errorText);
        } else {
            logger.info(`评论通知已成功推送给: ${creatorId}`);
        }
    } catch (error) {
        logger.error("评论推送逻辑发生错误:", error);
    }
});
