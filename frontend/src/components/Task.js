import React from "react";

export default function Task(props) {
  const { task, changeCompleted, startEdit, deleteItem } = props;
  
  return (
    <div className="task-wrapper flex-wrapper">
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
  );
}
