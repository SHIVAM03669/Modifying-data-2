const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Define MenuItem Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Update Menu Item
app.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating menu item", error });
  }
});

// Delete Menu Item
app.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu item", error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
