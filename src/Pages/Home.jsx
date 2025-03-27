import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../Pages/Home.css";

function Home() {
  const [property, setProperty] = useState({
    title: "",
  });

  const handleChange = (e) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!property.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Task cannot be empty!",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      await axios.post("https://backendtodo-deb8.onrender.com/itemInserting", property);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Task added successfully",
        confirmButtonColor: "#3085d6",
      });
      setProperty({ title: "" });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Task not added",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="container">
      <h1>📝 To-Do List</h1>
      <div className="input-section">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={property.title}
            onChange={handleChange}
            placeholder="Enter a task..."
          />
          <button type="submit">Add Task</button>
        </form>
      </div>
      <List />
    </div>
  );
}

function List() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("https://backendtodo-deb8.onrender.com/itemInserting");
        console.log("Fetched tasks:", response.data);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://backendtodo-deb8.onrender.com/itemInserting/${id}`);
      if (response.status === 200) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Task has been removed.",
          confirmButtonColor: "#d33",
        });
      } else {
        throw new Error("Delete request failed");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete task!",
        confirmButtonColor: "#d33",
      });
    }
  };
  
  const handleUpdate = async (id) => {
    const newText = prompt("Update task:");
    if (!newText) return;
  
    try {
      const response = await axios.put(`https://backendtodo-deb8.onrender.com/itemInserting/${id}`, {
        title: newText,
      });
  
      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, title: newText } : task
          )
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Task has been modified.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        throw new Error("Update request failed");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update task!",
        confirmButtonColor: "#d33",
      });
    }
  };
  
  return (
    <section className="listings">
      <h2>📋 Your Tasks</h2>
      <div className="listing-container">
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map((task, index) => (
            <div key={index} className="listing-card">
              <div className="listing-details">
                <h4>{task.title}</h4>
              </div>
              <div className="action-buttons">
                <button className="update-btn" onClick={() => handleUpdate(task._id)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(task._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Home;
