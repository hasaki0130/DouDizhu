const express=require('express')
const http=require('http')
const socketIO=require('socket.io')
const cors=require('cors')
const jwt=require('jsonwebtoken')
const { decode } = require('punycode')
const app=express();
const server=http.createServer(app)
const io=socketIO(server)
const crypto=require('crypto')
const secretKey = crypto.randomBytes(32).toString('base64');

app.use(cors())

//中間件用於驗證JWT，並將用戶訊息添加到session
app.use((socket,next)=>{
    const token =socket.handshake.query.token;

    if(token){
        jwt.verify(token,secretKey,(err,decode)=>{
            if(err){
                return next(new Error('認證錯誤'));
            }
        //將用戶名添加
        /*使用...用於創建session的淺拷貝，創建一個新對象，包含原始對象的所有屬性
        並添加一個新屬性currentUsername,不會直接修改原始的session而是創建新對象,
        以確保不會對其他代碼或中間件產生不良影響
        */
            socket.handshake.session={
                ...socket.handshake.session,
                currentUsername: decode.username,
            };
            next();
        })
    }else{
        next(new Error('認證錯誤'));
    }
});

async function handleConnection(socket){
    const currentUsername = socket.handshake.session.currentUsername;// 從登入邏輯中獲取當前用戶名
    socket.join(currentUsername);
    console.log( currentUsername +'connected');

    //監聽客戶端發送的消息
    socket.on('chat message',(msg)=>{
        console.log('message'+ msg);
        //廣播消息給特定房間的所有客戶端
        io.to(currentUsername).emit('chat message', msg);
    });
    
    //監聽客戶端斷開連接
    socket.on('disconnect',()=>{
        console.log(currentUsername+'離開房間')
        socket.leave(currentUsername);
    })
}
io.on('connection',(socket)=>{
    handleConnection(socket);
})

const PORT = process.env.PORT || 3000;

server.listen(PORT,()=>{
    console.log('Server is running on port ${PORT}');

})

