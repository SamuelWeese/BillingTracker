<script>
  import { onMount } from "svelte";
  import Chart from 'chart.js/auto';
  
  let contracts = [];
  let newContract = {
    name: "",
    id: null,
    rate: 0,
    address: "",
    notes: "",
    hours: { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 }
  };

  let showForm = false;
  let expandedContract = null;
  let sortDirection = { field: null, asc: true };
  

  // Array to track required field errors
  let errorFields = {
    name: false,
    id: false
  };
  let theme = {
  backgroundColor: '#f9f9f9',
  headerColor: '#f4f4f4',
  textColor: '#000',
  borderColor: '#ccc',
  buttonColor: '#007bff',
  buttonHoverColor: '#0056b3',
};

let themes = [
  {
    name: "Default",
    colors: {
      backgroundColor: "#f9f9f9",
      headerColor: "#f4f4f4",
      textColor: "#000",
      borderColor: "#ccc",
      buttonColor: "#007bff",
      buttonHoverColor: "#0056b3",
    },
  },
  {
    name: "Dark",
    colors: {
      backgroundColor: "#282c34",
      headerColor: "#61dafb",
      textColor: "#ffffff",
      borderColor: "#61dafb",
      buttonColor: "#61dafb",
      buttonHoverColor: "#21a1f1",
    },
  },
  // Add more themes as needed
];

let selectedTheme = themes[0]; // Default to the first theme


  // Function to add a new contract
  function addContract() {
    // Reset error states
    errorFields = {
      name: !newContract.name,
      id: !newContract.id
    };

    // Check if required fields are filled out
    if (!newContract.name || newContract.id === null) {
      return; // Exit the function if there are errors
    }

    contracts = [...contracts, { ...newContract, id: Date.now() }];
    showForm = false;
    resetForm();
  }

  // Reset form for new entry
  function resetForm() {
    newContract = {
      name: "",
      id: null,
      rate: 0,
      address: "",
      notes: "",
      hours: { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 }
    };
    errorFields = { name: false, id: false }; // Reset error states
  }

    // Toggle dropdown for contract details
    function toggleContractDetails(contract) {
      expandedContract = expandedContract === contract ? null : contract;
    }
  
    // Handle Enter key to submit form
    function handleKeyPress(event) {
      if (event.key === 'Enter') {
        addContract();
      }
    }
  
    // Calculate total weekly hours for a contract
    function getTotalHours(contract) {
      return Object.values(contract.hours).reduce((sum, hours) => sum + parseFloat(hours), 0);
    }
  
    // Calculate total hours per day across all contracts
    function getTotalHoursPerDay(day) {
      return contracts.reduce((sum, contract) => sum + parseFloat(contract.hours[day] || 0), 0);
    }
  
    // Sorting logic
    function sortContractsBy(field) {
      if (sortDirection.field === field) {
        sortDirection.asc = !sortDirection.asc; // Toggle direction
      } else {
        sortDirection.field = field;
        sortDirection.asc = true; // Default to ascending on first click
      }
  
      if (field === 'name') {
        contracts.sort((a, b) => sortDirection.asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
      } else if (field === 'id') {
        contracts.sort((a, b) => sortDirection.asc ? a.id - b.id : b.id - a.id);
      } else if (field === 'entry') {
        contracts.sort((a, b) => sortDirection.asc ? a.id - b.id : b.id - a.id);  // Default sort by entry order
      } else {
        contracts.sort((a, b) => sortDirection.asc ? a.hours[field] - b.hours[field] : b.hours[field] - a.hours[field]);
      }
    }
  
    // Function to get sort arrow for a column
    function getSortArrow(field) {
      if (sortDirection.field !== field) return ''; // No arrow if not sorted
      return sortDirection.asc ? '↑' : '↓';
    }
  
    // Export individual contract data to CSV
    function exportContractToCSV(contract) {
      const csvContent = `
        Contract Name,Contract ID,Rate,Address,Notes,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday\n
        ${contract.name},${contract.id},${contract.rate},${contract.address},${contract.notes},${contract.hours.sunday},${contract.hours.monday},${contract.hours.tuesday},${contract.hours.wednesday},${contract.hours.thursday},${contract.hours.friday},${contract.hours.saturday}
      `;
      downloadCSV(csvContent, `${contract.name}_contract.csv`);
    }
  
    // Export all contracts to CSV
    function exportAllContractsToCSV() {
      let csvContent = `
        Contract Name,Contract ID,Rate,Address,Notes,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday\n
      `;
      contracts.forEach(contract => {
        csvContent += `${contract.name},${contract.id},${contract.rate},${contract.address},${contract.notes},${contract.hours.sunday},${contract.hours.monday},${contract.hours.tuesday},${contract.hours.wednesday},${contract.hours.thursday},${contract.hours.friday},${contract.hours.saturday}\n`;
      });
      downloadCSV(csvContent, `all_contracts.csv`);
    }
  
    // Helper function to download CSV
    function downloadCSV(csvContent, fileName) {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      link.click();
    }
  
    // Function to display chart (you can customize this part)
    function renderChart() {
      const ctx = document.getElementById('myChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          datasets: contracts.map(contract => ({
            label: contract.name,
            data: Object.values(contract.hours),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }))
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  // Function to change the theme
function changeTheme(newTheme) {
  theme = { ...theme, ...newTheme };
  
  // Update CSS variables
  document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
  document.documentElement.style.setProperty('--header-color', theme.headerColor);
  document.documentElement.style.setProperty('--text-color', theme.textColor);
  document.documentElement.style.setProperty('--border-color', theme.borderColor);
  document.documentElement.style.setProperty('--button-color', theme.buttonColor);
  document.documentElement.style.setProperty('--button-hover-color', theme.buttonHoverColor);
}
    onMount(() => {
      changeTheme(theme)
      renderChart();
    });
  </script>
 
 
<!--
   _____   _____   _____  
  / ____| / ____| / ____| 
 | |      | (___  | (___  
 | |       \___ \  \___ \ 
 | |____   ____) | ____) |
  \_____| |_____/ |_____/ 
-->
  <style>
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 8px;
    }
    th {
      background-color: #f4f4f4;
      cursor: pointer;
    }
    th .sort-arrow {
      margin-left: 5px;
      font-size: 0.8em;
    }
    .center-buttons {
      text-align: center;
      margin: 20px;
    }
    .contract-details {
      padding: 10px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      margin-bottom: 10px;
    }
    .total-row {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .contract-details {
    margin-top: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
  }

  :root {
  --background-color: #f9f9f9;
  --header-color: #f4f4f4;
  --text-color: #000;
  --border-color: #ccc;
  --button-color: #007bff;
  --button-hover-color: #0056b3;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--background-color);
}

th, td {
  border: 1px solid var(--border-color);
  padding: 8px;
}

th {
  background-color: var(--header-color);
  color: var(--text-color);
  cursor: pointer;
}

.contract-details {
  padding: 10px;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  margin-bottom: 10px;
}

.total-row {
  background-color: var(--header-color);
  font-weight: bold;
}

button {
  background-color: var(--button-color);
  color: var(--text-color);
}

button:hover {
  background-color: var(--button-hover-color);
}

  /* Styles for form keypress submission */
  .contract-form input,
  .contract-form textarea {
    display: block;
    margin-bottom: 10px;
  }
  .error {
    border: 2px solid red;
    animation: flash 0.5s linear infinite alternate;
  }

  @keyframes flash {
    0% { border-color: red; }
    100% { border-color: transparent; }
  }
</style>







<div>
  <label for="themeSelector">Select Theme:</label>
  <select id="themeSelector" bind:value={selectedTheme} on:change="{() => changeTheme(selectedTheme.colors)}">
    {#each themes as theme}
      <option>{theme.name}</option>
    {/each}
  </select>
</div>  

<h1>Contract Hours Tracker</h1>
  
  <table>
    <thead>
      <tr>
        <th on:click={() => sortContractsBy('name')}>Contract <span class="sort-arrow">{getSortArrow('name')}</span></th>
        <th on:click={() => sortContractsBy('sunday')}>Sunday <span class="sort-arrow">{getSortArrow('sunday')}</span></th>
        <th on:click={() => sortContractsBy('monday')}>Monday <span class="sort-arrow">{getSortArrow('monday')}</span></th>
        <th on:click={() => sortContractsBy('tuesday')}>Tuesday <span class="sort-arrow">{getSortArrow('tuesday')}</span></th>
        <th on:click={() => sortContractsBy('wednesday')}>Wednesday <span class="sort-arrow">{getSortArrow('wednesday')}</span></th>
        <th on:click={() => sortContractsBy('thursday')}>Thursday <span class="sort-arrow">{getSortArrow('thursday')}</span></th>
        <th on:click={() => sortContractsBy('friday')}>Friday <span class="sort-arrow">{getSortArrow('friday')}</span></th>
        <th on:click={() => sortContractsBy('saturday')}>Saturday <span class="sort-arrow">{getSortArrow('saturday')}</span></th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      {#each contracts as contract}
      <tr>
        <td>{contract.name}</td>
        <td><input type="number" bind:value={contract.hours.sunday} /></td>
        <td><input type="number" bind:value={contract.hours.monday} /></td>
        <td><input type="number" bind:value={contract.hours.tuesday} /></td>
        <td><input type="number" bind:value={contract.hours.wednesday} /></td>
        <td><input type="number" bind:value={contract.hours.thursday} /></td>
        <td><input type="number" bind:value={contract.hours.friday} /></td>
        <td><input type="number" bind:value={contract.hours.saturday} /></td>
        <td>
          <button on:click={() => toggleContractDetails(contract)}>Toggle Details</button> 
          <span>Total: {getTotalHours(contract)} hrs</span> <!-- Weekly hours next to Toggle Details -->
        </td>
      </tr>
      {#if expandedContract === contract}
      <tr>
        <td colspan="9">
          <div class="contract-details">
            <p><strong>ID:</strong> {contract.id}</p>
            <p><strong>Rate:</strong> {contract.rate}</p>
            <p><strong>Address:</strong> {contract.address}</p>
            <p><strong>Notes:</strong> {contract.notes}</p>
            <button on:click={() => exportContractToCSV(contract)}>Export Contract to CSV</button>
          </div>
        </td>
      </tr>
      {/if}
      {/each}
      <tr class="total-row">
        <td>Total</td>
        <td>{getTotalHoursPerDay('sunday')}</td>
        <td>{getTotalHoursPerDay('monday')}</td>
        <td>{getTotalHoursPerDay('tuesday')}</td>
        <td>{getTotalHoursPerDay('wednesday')}</td>
        <td>{getTotalHoursPerDay('thursday')}</td>
        <td>{getTotalHoursPerDay('friday')}</td>
        <td>{getTotalHoursPerDay('saturday')}</td>
        <td></td>
      </tr>
    </tbody>
  </table>
  
  <div class="center-buttons">
    <button on:click={() => showForm = true}>Add New Contract</button>
    <button on:click={exportAllContractsToCSV}>Export All Contracts</button>
  </div>
  
  {#if showForm}
    <div>
      <h3>New Contract Details</h3>
      <input type="text" placeholder="Contract Name" bind:value={newContract.name} class:error={errorFields.name} required on:keypress={handleKeyPress} />
      <input type="number" placeholder="Contract ID" bind:value={newContract.id} class:error={errorFields.id} required on:keypress={handleKeyPress} />
      <input type="number" placeholder="Rate (Optional)" bind:value={newContract.rate} on:keypress={handleKeyPress} />
      <input type="text" placeholder="Address (Optional)" bind:value={newContract.address} on:keypress={handleKeyPress} />
      <textarea placeholder="Notes (Optional)" bind:value={newContract.notes} on:keypress={handleKeyPress}></textarea>
      <button on:click={addContract}>Add Contract</button>
    </div>
  {/if} 
  
  <h2>Graphs</h2>
  <canvas id="myChart" width="400" height="200"></canvas>