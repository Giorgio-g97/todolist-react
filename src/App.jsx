import React, { useEffect, useReducer, useState } from 'react';

//Stati iniziali
const initial_state = [];

//reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return [
        ...state,
        {
          id: Math.random(),
          text: action.payload,
          done: false,
          isEditing: false,
        },
      ];
    case 'EDIT_TASK':
      return state.map((t) => {
        if (t.id === action.payload) {
          return {
            ...t,
            isEditing: !t.isEditing,
            done: false,
          };
        } else {
          return t;
        }
      });
    case 'CHECK_TASK':
      return state.map((t) => {
        if (t.id === action.payload) {
          //Se l'id del map coincide proprio con l'id del task che sto selezionando
          return {
            ...t, //ritorna sempre lo stesso oggetto "t" con le stesse proprietà
            done: !t.done, //ma con unica modifica: la chiave-valore t.done (!t.done per effetto toggle, così ogni volta che cliccherò, il valore sarà sempre l'opposto dell'attuale)
          };
        } else {
          return t; //Altrimenti ritorna l'oggetto senza modifiche
        }
      });
    case 'DELETE_TASK':
      return state.filter((t) => {
        //per eliminare filta i tasks
        if (t.id !== action.payload) {
          //come condizione, se l'id è diverso da
          return [...state];
        }
      });
    case 'UPDATE_TASK':
      return state.map((t) => {
        if (t.id === action.payload.id) {//Se l'id che sto prendendo coincide con uno degli id degli stati
          return action.payload;//ritorno la modifica fatta giù con e.target.value
        } else {//Altrimenti
          return t;//Ritorna l'oggetto originale
        }
      });
    default:
      state;
  }
}

export default function App() {
  const [tasks, dispatch] = useReducer(reducer, initial_state);
  const [text, setText] = useState('');

  //Funzioni
  function addTask(e) {
    e.preventDefault();
    dispatch({ type: 'ADD_TASK', payload: text });
    setText('');
  }

  function toggleDone(id) {
    dispatch({ type: 'CHECK_TASK', payload: id });
  }

  function delTask(id) {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }

  function editTask(id) {
    dispatch({ type: 'EDIT_TASK', payload: id });
  }

  function updateTask(task) {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  }

  console.log(tasks);

  return (
    <>
      {/* Input field */}
      <form onSubmit={addTask}>
        <input
          className="border-2 border-gray-300 p-1 m-3"
          type="text"
          placeholder="Add Task"
          value={text}
          onChange={(e) => setText(e.target.value)} //All'input del campo, aggiorna lo stato del testo
        />
        <button type="submit" className="bg-red-200 p-1 rounded-lg">
          Add Task
        </button>
      </form>
      {/* Task list */}
      <ul>
        {tasks.map((task) =>
          task.isEditing ? (
            // Modifica ON
            <div key={task.id}>
              <input
                className="border-2 border-gray-300 p-1 m-3"
                type="text"
                value={task.text}
                onChange={(e) =>
                  updateTask({//Passa come parametro alla funzione
                    ...task,//l'intero oggetto con tutte le sue proprietà che passerò alla funzione di modifica
                    text: e.target.value,//Tranne per la modifica che sarà ugugale al valore del testo
                  })
                }
                placeholder="Aggiorna task"
              />
              <button
                className="ml-3 bg-yellow-300 p-1 rounded-xl font-bold"
                onClick={() => editTask(task.id)}
              >
                Aggiorna Task
              </button>
            </div>
          ) : (
            // Modifica OFF
            <li
              key={task.id}
              onClick={() => toggleDone(task.id)}
              className={
                task.done
                  ? 'list-disc ml-8 line-through'
                  : 'list-disc ml-8 font-bold'
              }
            >
              {task.text}
              <button
                onClick={() => editTask(task.id)}
                className="ml-3 bg-yellow-300 p-1 rounded-xl font-bold"
              >
                Edit
              </button>
              <button
                className="ml-3 bg-red-300 p-1 rounded-xl font-bold"
                onClick={() => delTask(task.id)}
              >
                Delete
              </button>
            </li>
          )
        )}
      </ul>
    </>
  );
}
