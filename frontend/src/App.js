import React, { useState, useEffect } from "react";
import "./App.css";
import Tasks from "./components/Tasks";
import { css } from "@emotion/core";
import PulseLoader from "react-spinners/ClipLoader";

function App() {
  const domain = "http://127.0.0.1:8000";

  const defaultItem = {
    id: null,
    name: "",
    submitted: false,
  };

  // State variables
  const [tasks, setTasks] = useState([]);
  const [activeItem, setActiveItem] = useState(defaultItem);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch items when component renders
  useEffect(() => {
    console.log("Fetching...");
    fetchTasks();
  }, []);

  // Get items from DB
  const fetchTasks = async () => {
    setLoading(true);
    const response = await fetch(`${domain}/api/v1/task-list/`);
    const data = await response.json();
    setLoading(false);
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
      let url = `${domain}/api/v1/task-create`;

      if (editing) {
        url = `${domain}/api/v1/task-update/${activeItem.id}`;
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
        fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const spinnerStyle = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

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

        {loading ? (
          <PulseLoader css={spinnerStyle} size={50} loading={loading} />
        ) : (
          <Tasks
            domain={domain}
            setActiveItem={setActiveItem}
            getCookie={getCookie}
            setEditing={setEditing}
            fetchTasks={fetchTasks}
            tasks={tasks}
          />
        )}
      </div>
    </div>
  );
}

export default App;
