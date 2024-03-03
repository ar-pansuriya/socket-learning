const authRoute  = require('./routes/authRoute');
const cors = require('cors');
const connectDB  = require('./db');
const cookieParser = require('cookie-parser');
const { app, server, express } = require('./socket.io/socket');
const chatRoute = require('./routes/chatRoute');

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//all routes for authentication
app.use('/api/auth',authRoute);
//chats app routes
app.use('/api/',chatRoute);




server.listen(5000,()=>{
    connectDB();
    console.log('server is working');
});



