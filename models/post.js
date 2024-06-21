const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "貼文名稱未填寫"],
        },
        image: {
            type: String,
            default: ""
        },
        content: {
            type: String,
            required: [true, 'Content 未填寫']
        },
        likes: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false  // 搜尋時不顯示
        },
    },
    { versionKey: false }  // 移除欄位 __v 方法」
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;