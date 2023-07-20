const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const inventoryRoutes = require('./routes/inventoryRoutes');
const InventoryItem = require('./models/InventoryItem');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://praneeth:Praneeth135@cluster0.qoyuuut.mongodb.net/inventory1?retryWrites=true&w=majority'
)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error);
  });

// Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

app.use(express.json());

// Routes
app.use('/api/inventory', inventoryRoutes);

// Socket.io
io.on('connection', (socket) => {
    console.log('A client connected');
  
    // Send current stock to the client
    async function fetchData() {
      try {
        const inventoryItems = await InventoryItem.find({});
        // Your code to handle the results
        console.log(inventoryItems);
  
        const stockData = inventoryItems.map((item) => ({
          itemId: item._id,
          stockQuantity: item.stockQuantity,
        }));
  
        socket.emit('currentStock', stockData);
      } catch (error) {
        // Your code to handle errors
        console.error(error);
      }
    }
  
    fetchData();
  
    // Listen for stock updates
    socket.on('stockUpdate', ({ itemId, stockQuantity }) => {
      // Update stock quantity in the database
      InventoryItem.findByIdAndUpdate(
        itemId,
        { stockQuantity },
        { new: true },
        (err, item) => {
          if (err) {
            console.error(err);
            return;
          }
  
          // Broadcast the updated stock to all connected clients
          const updatedStockData = {
            itemId: item._id,
            stockQuantity: item.stockQuantity,
          };
          io.emit('stockUpdate', updatedStockData);
        }
      );
    });
  
    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });
  });