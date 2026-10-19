
const taskForm = document.querySelector("#task-form")
const taskInput = document.querySelector("#task-input")
const taskList = document.querySelector("#task-list")
const totalTasks = document.querySelector("#total-tasks")
const completedTasks = document.querySelector("#completed-tasks")

const filterButtons = document.querySelectorAll("#task-filters button")
const searchInput = document.querySelector("#search-input")

let currentFilter = "all"

function updateStats() {
  const tasks = taskList.querySelectorAll(":scope > div")
  const completed = taskList.querySelectorAll(
    ':scope > div input[type="checkbox"]:checked'
  )

  totalTasks.textContent = tasks.length
  completedTasks.textContent = completed.length
}

function saveTasks() {
  const checkboxes = taskList.querySelectorAll('input[type="checkbox"]')

  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      checkbox.setAttribute("checked", "")
    } else {
      checkbox.removeAttribute("checked")
    }
  })

  localStorage.setItem("tasks", taskList.innerHTML)
}

function applyFilters() {
  const searchText = searchInput.value.toLowerCase().trim()
  const tasks = taskList.querySelectorAll(":scope > div")

  tasks.forEach(function (task) {
    const title = task.querySelector("h3").textContent.toLowerCase()
    const checkbox = task.querySelector('input[type="checkbox"]')

    const matchesSearch = title.includes(searchText)
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !checkbox.checked) ||
      (currentFilter === "completed" && checkbox.checked)

    task.style.display = matchesSearch && matchesFilter ? "flex" : "none"
  })
}

function setupTask(task) {
  const checkbox = task.querySelector('input[type="checkbox"]')
  const title = task.querySelector("h3")
  const deleteButton = task.querySelector("button")

  checkbox.addEventListener("change", function () {
    title.style.textDecoration = checkbox.checked ? "line-through" : "none"

    updateStats()
    applyFilters()
    saveTasks()
  })

  deleteButton.addEventListener("click", function () {
    task.remove()
    updateStats()
    applyFilters()
    saveTasks()
  })

  title.style.textDecoration = checkbox.checked ? "line-through" : "none"
}

const savedTasks = localStorage.getItem("tasks")

if (savedTasks !== null) {
  taskList.innerHTML = savedTasks
}

taskList.querySelectorAll(":scope > div").forEach(function (task) {
  setupTask(task)
})

taskForm.addEventListener("submit", function (event) {
  event.preventDefault()

  const taskText = taskInput.value.trim()

  if (taskText === "") {
    return
  }

  const taskItem = document.createElement("div")
  const taskCheckbox = document.createElement("input")
  const taskTitle = document.createElement("h3")
  const deleteButton = document.createElement("button")

  taskCheckbox.type = "checkbox"
  taskTitle.textContent = taskText
  deleteButton.type = "button"
  deleteButton.textContent = "O‘chirish"

  taskItem.append(taskCheckbox)
  taskItem.append(taskTitle)
  taskItem.append(deleteButton)

  taskList.append(taskItem)

  setupTask(taskItem)

  taskInput.value = ""

  updateStats()
  applyFilters()
  saveTasks()
})

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter
    applyFilters()
  })
})

searchInput.addEventListener("input", applyFilters)

updateStats()
applyFilters()
