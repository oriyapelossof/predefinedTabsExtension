// Load categories and websites when the popup opens
function loadCategories() {
    chrome.storage.sync.get(['categories'], function(result) {
      let categories = result.categories || {};
  
      const categoryDropdown = document.getElementById('categoryDropdown');
      categoryDropdown.innerHTML = ''; // Clear dropdown
  
      // Populate dropdown with categories
      for (let category in categories) {
        let option = document.createElement('option');
        option.text = category;
        categoryDropdown.add(option);
      }
  
      // Automatically load websites for the first category
      if (categoryDropdown.options.length > 0) {
        loadWebsites(categoryDropdown.value);
      }
    });
  }
  
  // Load the websites for the selected category
  function loadWebsites(category) {
    chrome.storage.sync.get(['categories'], function(result) {
      const websiteList = document.getElementById('websiteList');
      websiteList.innerHTML = ''; // Clear existing list
  
      let websites = result.categories[category] || [];
  
      // Create input fields for each website
      websites.forEach((website, index) => {
        let input = document.createElement('input');
        input.type = 'text';
        input.value = website;
        input.id = `website-${index}`;
        input.style.margin = '5px';
        websiteList.appendChild(input);
        websiteList.appendChild(document.createElement('br'));
      });
    });
  }
  
  // Save websites for the selected category
  document.getElementById('saveButton').addEventListener('click', function() {
    const category = document.getElementById('categoryDropdown').value;
    const websiteList = document.getElementById('websiteList');
    let inputs = websiteList.getElementsByTagName('input');
    let websites = [];
  
    // Collect website URLs
    for (let input of inputs) {
      let value = input.value.trim();
      if (value != '') {
        websites.push(value);
      }
    }
  
    // Save websites to storage
    chrome.storage.sync.get(['categories'], function(result) {
      let categories = result.categories || {};
      categories[category] = websites;
      chrome.storage.sync.set({ categories: categories }, function() {
        alert('Websites saved!');
      });
    });
  });
  
  // Add a new category
  document.getElementById('addCategoryButton').addEventListener('click', function() {
    let newCategory = prompt("Enter a new category:");
    if (newCategory != '') {
      chrome.storage.sync.get(['categories'], function(result) {
        let categories = result.categories || {};
        if (!categories[newCategory]) {
          categories[newCategory] = [];
          chrome.storage.sync.set({ categories: categories }, function() {
            loadCategories();
          });
        } else {
          alert("Category already exists!");
        }
      });
    }
  });
  
  // Delete the selected category
  document.getElementById('deleteCategoryButton').addEventListener('click', function() {
    const category = document.getElementById('categoryDropdown').value;
    if (confirm(`Are you sure you want to delete the category "${category}"?`)) {
      chrome.storage.sync.get(['categories'], function(result) {
        let categories = result.categories || {};
        delete categories[category];
        chrome.storage.sync.set({ categories: categories }, function() {
          loadCategories();
        });
      });
    }
  });
  
  // Add a new website field
  document.getElementById('addWebsiteButton').addEventListener('click', function() {
    const websiteList = document.getElementById('websiteList');
    let newInput = document.createElement('input');
    let newIndex = websiteList.getElementsByTagName('input').length;
    newInput.type = 'text';
    newInput.id = `website-${newIndex}`;
    newInput.style.margin = '5px';
    websiteList.appendChild(newInput);
    websiteList.appendChild(document.createElement('br'));
  });
  
  // Open tabs for the selected category
  document.getElementById('openTabsButton').addEventListener('click', function() {
    const category = document.getElementById('categoryDropdown').value;
    chrome.storage.sync.get(['categories'], function(result) {
      let websites = result.categories[category] || [];
      websites.forEach(function(website) {
        chrome.tabs.create({ url: website });
      });
    });
  });
  
  // Load categories on popup open
  loadCategories();
  
  // Reload websites when a new category is selected
  document.getElementById('categoryDropdown').addEventListener('change', function() {
    loadWebsites(this.value);
  });
  