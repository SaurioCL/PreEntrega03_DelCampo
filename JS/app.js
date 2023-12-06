document.addEventListener('DOMContentLoaded', function () {
    
    function esCadenaVacia(cadena) {
        return cadena.trim() === '';
    }
    
    function contieneSoloLetras(cadena) {
        return /^[a-zA-Zá-únÑ\s]*$/.test(cadena);
    }
    
    //Variables de JS
    const nombreCompleto = document.getElementById('nombreCompleto');
    const nombreInput = document.getElementById('nombreInput');
    const ingresarNombreButton = document.getElementById('ingresarNombreButton');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskTimeInput = document.getElementById('taskTime');
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const filterCompletedButton = document.getElementById('filterCompletedButton');
    const showAllButton = document.getElementById('showAllButton');
    const tasks = [];
    const storedNombre = localStorage.getItem('nombre');

    if (storedNombre) {
        nombreCompleto.textContent = storedNombre;
    }

    ingresarNombreButton.addEventListener('click', function () {
        const nombre = nombreInput.value.trim();

        if (!esCadenaVacia(nombre) && contieneSoloLetras(nombre)) {
            localStorage.setItem('nombre', nombre);
            nombreCompleto.textContent = nombre;
        } else {
            mostrarMensaje('Por favor, ingresa tu nombre sin números.');
        }
    });

    //Funcion para mensajes
    function mostrarMensaje(mensaje) {
        const mensajesAnteriores = document.querySelectorAll('.mensaje');
        mensajesAnteriores.forEach(mensajeAnterior => {
            mensajeAnterior.remove();
        });

        const mensajeElemento = document.createElement('p');
        mensajeElemento.textContent = mensaje;
        mensajeElemento.classList.add('mensaje');

        taskForm.insertAdjacentElement('afterend', mensajeElemento);
    
        messagesContainer.appendChild(mensajeElemento);
    }

    //Funciones esenciales
    function addTask(text, time) {
        const task = {
            id: Date.now(),
            text: text,
            time: time,
            completed: false
        };

        tasks.push(task);
        saveTasksToLocalStorage();
        renderTask(task);
        mostrarMensaje(`Tarea "${task.text}" agregada correctamente.`);
    }

    function renderTask(task) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        const timeSpan = document.createElement('span');
        const deleteButton = document.createElement('span');

        span.textContent = task.text;
        timeSpan.textContent = `Hora: ${task.time}`;
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'delete';

        deleteButton.addEventListener('click', function () {
            deleteTask(task.id);
        });

        li.appendChild(span);
        li.appendChild(timeSpan);
        li.appendChild(deleteButton);

        if (task.completed) {
            li.classList.add('completed');
        }

        li.addEventListener('click', function () {
            toggleTaskStatus(task.id);
        });

        taskList.appendChild(li);
    }

    function deleteTask(id) {
        const index = tasks.findIndex(task => task.id === id);

        if (index !== -1) {
            tasks.splice(index, 1);
            saveTasksToLocalStorage();
            renderTasks();
            mostrarMensaje('Tarea eliminada correctamente.');
        }
    }

    function toggleTaskStatus(id) {
        const index = tasks.findIndex(task => task.id === id);

        if (index !== -1) {
            tasks[index].completed = !tasks[index].completed;
            saveTasksToLocalStorage();
            renderTasks();

            const action = tasks[index].completed ? 'completada' : 'marcada como no completada';
            mostrarMensaje(`Tarea "${tasks[index].text}" ${action}.`);
        }
    }

    function renderTasks() {
        tasks.sort((a, b) => {
            return new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`);
        });
        taskList.innerHTML = '';
        tasks.forEach(task => renderTask(task));
    }

    //función para buscar
    function searchTasks(query) {
        const lowerCaseQuery = query.toLowerCase();
        const searchResults = tasks.filter(task => task.text.toLowerCase().includes(lowerCaseQuery));
        renderFilteredTasks(searchResults);
        mostrarMensaje(`Mostrando resultados para "${query}".`);
    }

    function filterCompletedTasks() {
        const completedTasks = tasks.filter(task => task.completed);
        renderFilteredTasks(completedTasks);
        if (completedTasks.length > 0) {
            mostrarMensaje('Mostrando tareas completadas.');
        } else {
            mostrarMensaje('No hay tareas completadas.');
        }
    }

    function showAllTasks() {
        renderTasks();
        mostrarMensaje('Mostrando todas las tareas.');
    }

    function renderFilteredTasks(filteredTasks) {
        taskList.innerHTML = '';
        filteredTasks.forEach(task => renderTask(task));
    }
    
    //Guardar las tareas en el almacenamiento local
    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    //Obtener tareas almacenadas en el almacenamiento local
    function loadTasksFromLocalStorage() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));

        if (storedTasks) {
            tasks.push(...storedTasks);
            renderTasks();
        }
    }

    //Eventos
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const taskText = taskInput.value.trim();
        const taskTime = taskTimeInput.value;

        if (!esCadenaVacia(taskText) && !esCadenaVacia(taskTime)) {
            addTask(taskText, taskTime);
            taskInput.value = '';
            taskTimeInput.value = '';
        } else {
            mostrarMensaje('Por favor, completa ambos campos para agregar una tarea.');
        }
    });

    searchInput.addEventListener('input', function () {
        searchTasks(searchInput.value);
    });


    filterCompletedButton.addEventListener('click', function () {
        filterCompletedTasks();
    });

    showAllButton.addEventListener('click', function () {
        showAllTasks();
    });

    // Inicialización
    loadTasksFromLocalStorage();
});