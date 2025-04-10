const http=require("http");
const app=require("./app");
const server=http.createServer(app);
server.listen(process.env.PORT||9090,()=>{
    console.log(`Server is running on the PORT: ${process.env.PORT?process.env.PORT:9090}`)
})