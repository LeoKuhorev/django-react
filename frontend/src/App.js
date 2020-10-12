import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const defaultItem = {
    id: null,
    name: "",
    submitted: false,
  };

  // State variables
  const [activeItem, setActiveItem] = useState(defaultItem);
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(false);

  // Fetch items when component renders
  useEffect(() => {
    fetchTasks();
  });

  // Get items from DB
  const fetchTasks = async () => {
    const response = await fetch("http://localhost:8000/api/v1/task-list/");
    const data = await response.json();
    setTasks(data);
  };

  const handleChange = (e) => {
    const name = e.target.value;
    setActiveItem({ ...activeItem, name: name });
  };

  // Get a value from the cookie
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const csrftoken = getCookie("csrftoken");
      let url = "http://localhost:8000/api/v1/task-create";

      if (editing) {
        url = `http://localhost:8000/api/v1/task-update/${activeItem.id}`;
        setEditing(false);
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(activeItem),
      });

      if (response.status === 200) {
        setActiveItem(defaultItem);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startEdit = (task) => {
    setActiveItem(task);
    setEditing(true);
  };

  const deleteItem = async (task) => {
    const csrftoken = getCookie("csrftoken");
    const url = `http://localhost:8000/api/v1/task-delete/${task.id}`;
    try {
      await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const changeCompleted = async (task) => {
    task.completed = !task.completed;
    const csrftoken = getCookie("csrftoken");
    const url = `http://localhost:8000/api/v1/task-update/${task.id}`;

    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(task),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div id="task-container">
        <div id="form-wrapper">
          <form id="form" onSubmit={handleSubmit}>
            <div className="flex-wrapper">
              <div style={{ flex: 6 }}>
                <input
                  className="form-control"
                  id="name"
                  type="text"
                  value={activeItem.name}
                  placeholder="Add task..."
                  onChange={handleChange}
                />
              </div>

              <div style={{ flex: 1 }}>
                <input id="submit" type="submit" className="btn btn-warning" />
              </div>
            </div>
          </form>
        </div>

        <div id="list-wrapper">
          {tasks.map((task) => (
            <div className="task-wrapper flex-wrapper" key={task.id}>
              <div style={{ flex: 7 }} onClick={() => changeCompleted(task)}>
                {task.completed ? (
                  <strike>{task.name}</strike>
                ) : (
                  <span>{task.name}</span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <button
                  className="btn btn-sm btn-outline-info"
                  onClick={() => startEdit(task)}
                >
                  Edit
                </button>
              </div>

              <div style={{ flex: 1 }}>
                <button
                  className="btn btn-sm btn-outline-danger delete"
                  onClick={() => deleteItem(task)}
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;