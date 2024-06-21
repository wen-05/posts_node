const http = require("http");
const dotenv = require("dotenv")
const mongoose = require('mongoose');

const Post = require('./models/post');
const headers = require('./headers');
const handleSuccess = require('./handleSuccess');
const handleError = require('./handleError');

// 環境變數 + 連接資料庫
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)

mongoose.connect(DB)
    .then(() => {
        console.log('資料庫連線成功')
    })
    .catch((err) => {
        console.log(err);
    });

// Route
const requestListener = async (req, res) => {

    let body = "";
    req.on('data', chunk => {
        body += chunk;
    })

    if (req.url == "/posts" && req.method == "GET") {
        const getData = await Post.find();
        handleSuccess(res, "取得貼文所有資料", getData);
    } else if (req.url == "/posts" && req.method == "POST") {
        req.on('end', async () => {
            try {
                const getData = JSON.parse(body);

                // 判斷必填欄位是否填寫
                if (!getData.name || !getData.content) {
                    return handleError(res, "請確實填寫必填欄位");
                }

                await Post.create(getData);
                handleSuccess(res, "新增資料成功", getData);
            } catch (err) {
                handleError(res, err);
            }
        })
    } else if (req.url.startsWith("/posts/") && req.method == "PATCH") {
        req.on('end', async () => {
            const urlId = req.url.split('/').pop();   // 返回最後一個元素
            try {
                const oldData = await Post.findById(urlId);
                const getData = JSON.parse(body);

                // 判斷必填欄位是否填寫
                if (!getData.name || !getData.content) {
                    return handleError(res, "請確實填寫必填欄位");
                }

                if (oldData) {
                    // 判斷是否有修改欄位
                    const isDifferent = Object.keys(getData).some(key => oldData[key] !== getData[key]);

                    if (isDifferent) {
                        newData = await Post.findByIdAndUpdate(urlId, getData, { new: true });   // 取得最新資料
                        handleSuccess(res, "單筆資料更新成功", newData);
                    } else {
                        handleError(res, "欄位資料與原資料相同");
                    }
                }
            } catch (err) {
                handleError(res, "找不到此id");
            }
        })
    } else if (req.url == "/posts" && req.method == "DELETE") {
        await Post.deleteMany({});
        handleSuccess(res, "刪除所有資料成功", []);
    } else if (req.url.startsWith("/posts/") && req.method == "DELETE") {
        const urlId = req.url.split('/').pop();
        try {
            const oldData = await Post.findById(urlId);
            if (oldData){
                const id = oldData._id.toString();
                await Post.findByIdAndDelete(id);
                handleSuccess(res, `此資料刪除成功`, null);
            }
        } catch (error) {
            handleError(res, "找不到此id資料");
        }
    } else if (req.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    } else {
        handleError(res, "無此網站路由");
    }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT);