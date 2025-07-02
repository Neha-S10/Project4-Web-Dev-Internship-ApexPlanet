// Navigation active link highlighting
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      navLinks.forEach(l => l.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // Contact Form Handling (basic validation + message)
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      formMessage.style.color = 'red';
      formMessage.textContent = 'Please fill in all fields.';
      return;
    }
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formMessage.style.color = 'red';
      formMessage.textContent = 'Please enter a valid email.';
      return;
    }

    formMessage.style.color = 'green';
    formMessage.textContent = 'Thank you for your message! I will get back to you soon.';

    // Reset form
    contactForm.reset();
  });

  // --- To-Do List with localStorage ---
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
      taskList.innerHTML = '<li>No tasks yet. Add one!</li>';
      return;
    }
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = task.done ? 'done' : '';
      // Task text span (click to toggle done)
      const span = document.createElement('span');
      span.textContent = task.text;
      span.className = 'task-text';
      span.title = 'Click to mark as done/undone';
      span.addEventListener('click', () => {
        tasks[index].done = !tasks[index].done;
        saveTasks();
        renderTasks();
      });
      li.appendChild(span);

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.className = 'delete';
      delBtn.title = 'Delete task';
      delBtn.addEventListener('click', () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });
      li.appendChild(delBtn);

      taskList.appendChild(li);
    });
  }

  addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text === '') return;
    tasks.push({ text, done: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
  });

  // Allow Enter key to add task
  taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      addTaskBtn.click();
    }
  });

  // Initial render
  renderTasks();

  // --- Product Listing with Filtering and Sorting ---
  const products = [
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 99.99, rating: 4.5, description: 'High-quality wireless headphones with noise cancellation.' },
    { id: 2, name: 'Coffee Maker', category: 'Home Appliances', price: 49.99, rating: 4.0, description: 'Brew delicious coffee with this easy-to-use coffee maker.' },
    { id: 3, name: 'Running Shoes', category: 'Sportswear', price: 79.99, rating: 4.7, description: 'Comfortable and durable running shoes for all terrains.' },
    { id: 4, name: 'Smartwatch', category: 'Electronics', price: 199.99, rating: 4.3, description: 'Track your fitness and notifications with this stylish smartwatch.' },
    { id: 5, name: 'Blender', category: 'Home Appliances', price: 39.99, rating: 3.9, description: 'Powerful blender perfect for smoothies and sauces.' },
    { id: 6, name: 'Yoga Mat', category: 'Sportswear', price: 29.99, rating: 4.1, description: 'Non-slip yoga mat with extra cushioning for comfort.' },
    { id: 7, name: 'Laptop Stand', category: 'Electronics', price: 25.99, rating: 4.0, description: 'Ergonomic laptop stand to improve posture.' },
    { id: 8, name: 'Air Purifier', category: 'Home Appliances', price: 129.99, rating: 4.6, description: 'Keep your indoor air clean and fresh.' }
  ];

  const categoryFilter = document.getElementById('categoryFilter');
  const sortOption = document.getElementById('sortOption');
  const productList = document.getElementById('product-list');

  // Populate category filter options dynamically
  function populateCategories() {
    const categories = ['all', ...new Set(products.map(p => p.category))];
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat === 'all' ? 'All Categories' : cat;
      categoryFilter.appendChild(option);
    });
  }

  function renderProducts() {
    let filtered = [...products];

    // Filter by category
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Sort products
    const sortVal = sortOption.value;
    if (sortVal === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'rating-desc') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortVal === 'rating-asc') {
      filtered.sort((a, b) => a.rating - b.rating);
    }

    // Clear list
    productList.innerHTML = '';

    if (filtered.length === 0) {
      productList.innerHTML = '<p>No products found for selected filters.</p>';
      return;
    }

    // Render cards
    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';

      const title = document.createElement('h3');
      title.textContent = p.name;
      card.appendChild(title);

      const desc = document.createElement('p');
      desc.textContent = p.description;
      card.appendChild(desc);

      const price = document.createElement('div');
      price.className = 'price';
      price.textContent = `$${p.price.toFixed(2)}`;
      card.appendChild(price);

      const rating = document.createElement('div');
      rating.className = 'rating';
      rating.textContent = '⭐'.repeat(Math.round(p.rating)) + ` (${p.rating.toFixed(1)})`;
      card.appendChild(rating);

      productList.appendChild(card);
    });
  }

  // Event listeners for filters
  categoryFilter.addEventListener('change', renderProducts);
  sortOption.addEventListener('change', renderProducts);

  // Initialize
  populateCategories();
  renderProducts();
