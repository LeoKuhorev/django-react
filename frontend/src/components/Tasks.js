import React from "react";
import Task from "./Task";
import { css } from "@emotion/core";
import PulseLoader from "react-spinners/ClipLoader";

export default function Tasks(props) {
  const {
    tasks,
    domain,
    setActiveItem,
    getCookie,
    setEditing,
    fetchTasks,
  } = props;

  const startEdit = (task) => {
    setActiveItem(task);
    setEditing(true);
  };

  const changeCompleted = async (task) => {
    task.completed = !task.completed;
    const csrftoken = getCookie("csrftoken");
    const url = `${domain}/api/v1/task-update/${task.id}`;

    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(task),
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (task) => {
    const csrftoken = getCookie("csrftoken");
    const url = `${domain}/api/v1/task-delete/${task.id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      });
      if (response.status === 200) {
        fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="list-wrapper">
      {tasks &&
        tasks.map((task) => (
          <Task
            task={task}
            startEdit={startEdit}
            changeCompleted={changeCompleted}
            deleteItem={deleteItem}
            key={task.id}
          />
        ))}
    </div>
  );
}
