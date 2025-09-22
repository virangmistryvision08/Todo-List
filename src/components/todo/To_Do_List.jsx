import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Alert, AlertTitle, Box, Modal, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createTodo, deleteTodo, editTodo, toggleTodo } from "./TodoSlice";
import noFoundData from "../../assets/images/No data-rafiki.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

const To_Do_List = () => {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState({ todoName: "" });
  const [errorMSG, setErrorMSG] = useState("");
  const [completeTodoList, setCompleteTodoList] = useState([]);
  const [pendingTodo, setPendingTodo] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Todos");

  const { todo } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    setTodos([...todo.todos]);
    setCompleteTodoList([...todo.completeTodo]);
    setPendingTodo([...todo.pendingTodo]);
  }, [todo.todos, todo.completeTodo, todo.pendingTodo]);

  const getTodoOnChange = (e) => {
    const { name, value } = e.target;

    if (name === "todoName") {
      todoText[name] = value;
      todoText.id = todoText.id || Date.now();
      todoText.completed = todoText.completed || false;
      setTodoText({ ...todoText });
      setErrorMSG(value.trim() ? "" : "Empty Todo Input!");
    }

    if (name === "category") {
      setSelectedCategory(value);
    }
  };

  const handleTodo = (e) => {
    e.preventDefault();
    if (todoText.todoName === "" || todoText.todoName === undefined) {
      if (!todoText.todoName) {
        setErrorMSG("Empty Todo Input!");
      }
    } else {
      if (!id) {
        dispatch(createTodo(todoText));
      } else {
        dispatch(editTodo({ editId: id, editTodoText: todoText }));
        setId(null);
      }
      setOpenForm(false);
    }

    setTodoText({ todoName: "" });
  };

  const handleDelete = (deleteId) => {
    setOpenDelete(true);
    setId(deleteId);
  };

  const confirmationOfDeleteModal = () => {
    dispatch(deleteTodo(id));
    setId(null);
    setOpenDelete(false);
  };

  const cancelConfirmationOfDeleteModal = () => {
    setId(null);
    setOpenDelete(false);
  };

  const handleEdit = (editId) => {
    setOpenForm(true);
    const findTodo = todos.find((todo) => todo.id === editId);
    setId(findTodo.id);
    setTodoText({ ...findTodo });
  };

  const handleCloseFormModal = () => {
    setId(null);
    setOpenForm(false);
    setTodoText({ todoName: "" });
  };

  const handleCloseDeleteModal = () => {
    setId(null);
    setOpenDelete(false);
  };

  const getVisibleTodos = () => {
    if (selectedCategory === "Completed Todos") {
      return completeTodoList;
    }
    if (selectedCategory === "Pending Todos") {
      return pendingTodo;
    } else {
      return todos;
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-[70%] py-10">
          <div className="sticky top-0 bg-white">
            <h1
              className="uppercase text-center text-3xl text-blue-600 font-bold"
              style={{ textShadow: "3px 3px 1px skyBlue" }}
            >
              Todo List
            </h1>
            <hr className="mb-10 border-2 border-gray-300 rounded-full mt-2 w-20 mx-auto" />
            <div className="flex justify-between mb-5 sticky top-10 bg-white shadow-sm py-4 rounded-md z-50">
              <button
                disabled={
                  getVisibleTodos() === completeTodoList ||
                  getVisibleTodos() === pendingTodo 
                }
                onClick={() => setOpenForm(true)}
                className={` text-white flex items-center gap-1 text-sm p-1 md:!text-lg md:!p-3 md:!px-5 rounded-md ${
                  getVisibleTodos() === completeTodoList ||
                  getVisibleTodos() === pendingTodo
                    ? "bg-blue-300 text-white cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <AddCircleOutlineIcon className="!text-lg md:!text-xl" /> Add
                Todo
              </button>
              <select
                onChange={getTodoOnChange}
                className="p-1 w-32 md:p-3 md:w-auto bg-gray-200 rounded-md outline outline-blue-400 text-blue-700"
                name="category"
                value={selectedCategory}
              >
                <option value="All Todos">All Todos</option>
                <option value="Pending Todos">Pending Todos</option>
                <option value="Completed Todos">Completed Todos</option>
              </select>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3 rounded-md bg-gray-200 min-h-80">
            {getVisibleTodos().length === 0 ? (
              <div className="min-h-80 flex justify-center items-center rounded-md overflow-hidden">
                <img
                  className="h-80 object-cover object-center"
                  src={noFoundData}
                  alt="No Found"
                />
              </div>
            ) : (
              getVisibleTodos().map((todo) => (
                <div
                  key={todo.id}
                  className="flex flex-col md:flex-row transition-all"
                >
                  <label
                    htmlFor={`${todo.id}`}
                    className="bg-white cursor-pointer rounded-s-md flex justify-between items-center p-3 px-4 w-full"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <input
                        className="h-[20px] w-[20px]"
                        type="checkbox"
                        id={`${todo.id}`}
                        checked={todo.completed}
                        onChange={() => dispatch(toggleTodo(todo.id))}
                      />
                      <div
                        className={`font-bold w-auto lg:w-64 overflow-auto ${
                          todo.completed ? "line-through" : ""
                        }`}
                      >
                        {todo.todoName}
                      </div>
                      <div
                        className={`ms-auto md:mx-auto px-2 py-1 rounded-md ${
                          todo.completed
                            ? "bg-green-200 text-green-700"
                            : "bg-blue-100 text-blue-500"
                        }`}
                      >
                        {todo.completed ? "Completed" : "Pending"}
                      </div>
                    </div>
                  </label>
                  <div className="flex items-center gap-4 bg-white rounded-e-md p-3">
                    <div
                      onClick={() => handleEdit(todo.id)}
                      className="bg-blue-100 hover:bg-blue-200 cursor-pointer p-2 rounded-md text-blue-600"
                    >
                      <EditIcon />
                    </div>
                    <div
                      onClick={() => handleDelete(todo.id)}
                      className="bg-red-100 hover:bg-red-200 cursor-pointer p-2 rounded-md text-red-600"
                    >
                      <DeleteIcon />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={openForm}
        onClose={handleCloseFormModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="outline-none !w-[80%] md:!w-auto mx-auto">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {id ? "Edit Todo" : "Add Todo"}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={handleTodo}
              className="flex !items-start flex-col gap-3 md:gap-0 md:flex-row"
            >
              <div className="w-full">
                <input
                  autoFocus
                  onChange={getTodoOnChange}
                  className="h-[50px] outline-none bg-gray-100 p-3 rounded-md md:rounded-s-md md:rounded-e-md w-full"
                  type="text"
                  name="todoName"
                  placeholder="Enter Todo . . ."
                  value={todoText.todoName || ""}
                />
                <p className="text-red-500 block">{errorMSG}</p>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white w-full md:w-auto h-[50px] p-2 px-10 rounded-md md:rounded-s-none md:rounded-e-md"
              >
                {id ? "Update" : "Add"}
              </button>
            </form>
          </Typography>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={openDelete}
        onClose={handleCloseDeleteModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="outline-none">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Todo
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <h1 className="font-bold text-lg mb-3">
              Are you sure you want to Delete it ?
            </h1>
            <div className="flex justify-end items-center gap-3">
              <button
                onClick={cancelConfirmationOfDeleteModal}
                className="bg-blue-500 text-white rounded-md px-5 py-2"
              >
                No
              </button>
              <button
                onClick={confirmationOfDeleteModal}
                className="bg-red-600 text-white rounded-md px-5 py-2"
              >
                Yes
              </button>
            </div>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default To_Do_List;
