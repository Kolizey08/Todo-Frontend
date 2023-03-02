import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodos, deleteTodos, fetchTodos, patchTodos } from "./features/todoSlice";
import styles from './styles.module.css'

function Todos() {
  const todos = useSelector((state) => state.todoSlice.todos);
  const loading = useSelector((state) => state.todoSlice.loading);
  const error = useSelector((state) => state.todoSlice.error);

  const [text, setText] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  console.log(todos);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleText = (e) => {
    setText(e.target.value);
  };

  const handleAdd = () => {
    dispatch(addTodos(text));
    setText('')
  };

  const handleDelete = (i) => {
    dispatch(deleteTodos(todos[i]._id));
  };

  const handlePatch = (item) => {
    
    dispatch(patchTodos({id: item._id, complated: item.complated}))
  }

  if (error) {
    return error;
  }

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input className={styles.inp} value={text} onChange={handleText} />
        <button className={styles.btn} onClick={handleAdd}>добавить</button>
      </form>

      <div className="todos">
        {loading && <h1>Loading...</h1>}
        {todos.map((item, index) => {
          return (
            <div className={styles.divText}>
              <input className={styles.inp2} type="checkbox" checked={item.complated} onChange={() =>handlePatch(item)} /> <span>{item.text}</span> 
              <button className={styles.btn2} onClick={() => handleDelete(index)}>x</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Todos;
