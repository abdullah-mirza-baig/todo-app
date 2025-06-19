import Task from '../models/Task.js';
import User from '../models/User.js';

export const createTask = async (req, res) => {
  // console.log("👀 req.body:", req.body);
  // console.log("👀 req.file:", req.file); // should show file metadata
  try {
    const { title, description, dueDate, priority, tags } = req.body;
    const filePath = req.file ? req.file.path : null;

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      dueDate,
      priority,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      file: filePath,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};




// export const getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({ user: req.user.id });
//     res.status(200).json(tasks);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
//   }
// };

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { user: req.user._id },
        { sharedWith: req.user._id }
      ]
    })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};


export const updateTask = async (req, res) => {
  try {
    const updateFields = {
      ...req.body,
    };

    // If a new file is uploaded, include it
    if (req.file) {
      updateFields.file = req.file.path;
    }

    // Optional: re-parse tags if sent as comma string
    if (updateFields.tags && typeof updateFields.tags === "string") {
      updateFields.tags = updateFields.tags.split(",").map(tag => tag.trim());
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateFields,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};


// Other controllers (createTask, getTasks, etc.)

export const shareTask = async (req, res) => {
  const { email } = req.body;

  try {
    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $addToSet: { sharedWith: targetUser._id } },
      { new: true }
    );

    if (!task) {
      return res.status(403).json({ error: 'Not authorized to share this task' });
    }

    res.status(200).json({ message: 'Task shared successfully', task });
  } catch (err) {
    console.error('Error sharing task:', err);
    res.status(500).json({ error: 'Server error while sharing task' });
  }
};
