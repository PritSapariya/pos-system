
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const { requireSignIn } = require('./controllers/authController');

require('dotenv').config();
const PORT = process.env.PORT || 5000

// MongoDB Connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.ly0fd.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
).then(() => console.log('Database Connected Successfully')).catch((err) => console.log(err))


// Routes
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoute)

// For Testing Purpose
app.use('/api/user', requireSignIn, userRoute)
app.use('/api/admin', requireSignIn, adminRoute)


app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));