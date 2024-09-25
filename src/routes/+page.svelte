<script>
  import { onMount } from "svelte";
  import Chart from 'chart.js/auto';
  import { Bar } from "svelte-chartjs";
  
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

    
  let activeTab = 0;

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
  
  function switchTab(index) {
    activeTab = index;
  }

/*
   _____  _    _            _____  _______  _____ 
  / ____|| |  | |    /\    |  __ \|__   __|/ ____|
 | |     | |__| |   /  \   | |__) |  | |  | (___  
 | |     |  __  |  / /\ \  |  _  /   | |   \___ \ 
 | |____ | |  | | / ____ \ | | \ \   | |   ____) |
  \_____||_|  |_|/_/    \_\|_|  \_\  |_|  |_____/
*/



let selectedTabs = [];

// Chart options
const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

// Function to toggle tab selection
function toggleTab(index) {
  if (selectedTabs.includes(index)) {
    selectedTabs = selectedTabs.filter(i => i !== index);
  } else {
    selectedTabs = [...selectedTabs, index];
  }
}

// Function to convert multiple contracts' hours into chart data
function generateChartData(contracts) {
  if (!contracts.length) return {}; // If no contracts selected, return empty

  // Colors for each dataset
  const colors = [
    "rgba(75,192,192,0.4)",
    "rgba(255,99,132,0.4)",
    "rgba(54,162,235,0.4)",
    "rgba(255,206,86,0.4)"
  ];

  return {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: contracts.map((contract, i) => ({
      label: `${contract.name} Hours`,
      backgroundColor: colors[i % colors.length],
      borderColor: colors[i % colors.length].replace("0.4", "1"),
      borderWidth: 1,
      data: Object.values(contract.hours)
    }))
  };
}  


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
  body, html, table, p, h1, h2, h3, h4, h5, h6, span, div, a, li, button {
    font-family: 'Quicksand', sans-serif;
    color: var(--text-color);
  }

  :root {
    /* Egyptian-themed colors */
    --border-color: #1a284b; /* Dark blue */
    --background-light: #f7e1a0; /* Tan/yellow */
    --background-dark: #192b45; /* Deep dark blue */
    --text-color: #f0d290; /* Light yellowish tan */
    --input-background: #fff4d2;
    --highlight-color: #ecc678; /* Soft yellow for highlights */
    --error-color: #e74c3c; /* Red for errors */
    --size-header: 180px;
    --chart-background: rgba(247, 225, 160, 0.6)
  }
  
  html {
    background-image: url("/sandsand.jpg");
    background-size: 100%; /* Ensures the image covers the entire page */
    background-position: center; /* Centers the image */
  }

  header {
    background-image: url("/sundial.png");
    background-size: calc(2 * var(--size-header)); /* Scales down the image */
    background-position: right center; /* Moves the image to the right */
    background-repeat: no-repeat; /* Prevents the image from repeating */
    height: var(--size-header); /* Slightly smaller header */
    display: flex;
    justify-content: space-between; /* Moves text to the left, image to the right */
    align-items: center;
    padding: 0 20px; /* Add padding to prevent text from sticking to the edge */
    color: var(--background-dark);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
    font-size: 2.3rem;
  }

  header h1 {
    color: var(--highlight-color);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--background-light);
    color: var(--text-color);
  }

  th, td {
    border: 1px solid var(--border-color);
    padding: 0.8vw; /* Slightly reduced padding for cleaner spacing */
  }

  th {
    background-color: var(--background-dark);
    color: var(--text-color);
    cursor: pointer;
  }
  td span {
    text-emphasis-color: var(--background-dark);
    color: var(--border-color);
  }
  td input{
    width: 100%;
    background-color: var(--input-background);
  }
button {
  background-color: var(--background-light);
  color: var(--background-dark);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}


button:hover {
  background-color: var(--highlight-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

  th .sort-arrow {
    margin-left: 0.3vw;
    font-size: 0.8em;
  }

  .center-buttons {
    text-align: center;
    margin: 1.5vw;
  }

  .contract-details {
    color: var(--background-dark);
    padding: 1vw;
    background-color: var(--highlight-color);
    border: 1px solid var(--border-color);
    margin-bottom: 1vw;
  }

  .contract-details p {
    color: var(--background-dark);
  }

  .total-row {
    background-color: var(--highlight-color);
    font-weight: bold;
    color: var(--background-dark);
  }

  /* Form styles */
.contract-form input,
.contract-form textarea,
.contract-form button {
  display: block;
  margin-bottom: 1vw;
  font-size: 16px;
  padding: 12px;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid var(--border-color);
  background-color: var(--background-light);
  color: var(--background-dark);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.contract-form input[type="number"] {
  width: auto;
  min-width: 100px;
  max-width: 200px;
}


.contract-form input:focus,
.contract-form textarea:focus {
  outline: none;
  border-color: var(--highlight-color);
  box-shadow: 0 0 0 3px rgba(236, 198, 120, 0.3);
}


.contract-form button {
  cursor: pointer;
}

.contract-form button:hover {
  background-color: var(--highlight-color);
}

  .error {
    border: 0.2vw solid var(--error-color);
    animation: flash 0.5s linear infinite alternate;
  }

  @keyframes flash {
    0% { border-color: var(--error-color); }
    100% { border-color: transparent; }
  }

.tabs button {
  background-color: var(--background-light);
  color: var(--background-dark);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 20px;
  margin-right: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tabs button:hover {
  background-color: var(--highlight-color);
  transform: translateY(-2px);
}

.tabs button.active {
  background-color: var(--highlight-color);
  font-weight: bold;
  border-bottom: 3px solid var(--border-color);
}

  .chart {
    background-color: var(--chart-background)
  }
  .chart {
    border-radius: 10px;
    border: var(--border-color)
  }
  .chart-paragraph {
  text-align: center;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--background-dark);
  color: var(--text-color);
  font-size: 1.25rem;
  line-height: 1.6;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-paragraph strong {
  color: var(--highlight-color);
}

  h3 {
    position: relative; /* Positioning for the pseudo-element */
    padding: 10px; /* Padding to space out the text */
    background-color: var(--light-blue-fade); /* Light blue fade background */
    border-radius: 5px; /* Rounded corners */
    display: inline-block; /* Makes the background only cover the text */
    z-index: 1; /* Ensures the background appears below text */
  }


 .contract-form {
  background-color: var(--background-light);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 2rem auto;
}

.contract-form h3 {
  color: var(--background-dark);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
}

.contract-form h3::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background-color: var(--highlight-color);
}

.contract-form input,
.contract-form textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  color: var(--background-dark);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.contract-form input:focus,
.contract-form textarea:focus {
  outline: none;
  border-color: var(--highlight-color);
  box-shadow: 0 0 0 3px rgba(236, 198, 120, 0.3);
}

.contract-form input::placeholder,
.contract-form textarea::placeholder {
  color: rgba(25, 43, 69, 0.6);
}

.contract-form button {
  width: 100%;
  padding: 12px;
  background-color: var(--highlight-color);
  color: var(--background-dark);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contract-form button:hover {
  background-color: var(--text-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.contract-form .error {
  border-color: var(--error-color);
  animation: shake 0.5s linear;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .contract-form {
    padding: 1.5rem;
  }
  
  .contract-form input,
  .contract-form textarea,
  .contract-form button {
    font-size: 0.9rem;
  }
} 

.total-hours {
  text-align: center;
}

.contract-name {
  color: var(--background-dark);
}
</style>


<html>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet"></head>
<header>
  <h1>Dialed in Hour Tracker</h1>
</header>
<body>



  
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
        <td class="contract-name">{contract.name}</td>
        <td><input type="number" bind:value={contract.hours.sunday} /></td>
        <td><input type="number" bind:value={contract.hours.monday} /></td>
        <td><input type="number" bind:value={contract.hours.tuesday} /></td>
        <td><input type="number" bind:value={contract.hours.wednesday} /></td>
        <td><input type="number" bind:value={contract.hours.thursday} /></td>
        <td><input type="number" bind:value={contract.hours.friday} /></td>
        <td><input type="number" bind:value={contract.hours.saturday} /></td>
        <td>
          <div>
            <button on:click={() => toggleContractDetails(contract)}>Details</button>
          </div>
          <div class="total-hours">
            <span>{getTotalHours(contract)} hrs</span> <!-- Weekly hours next to Toggle Details -->
          </div>
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
    <div class="contract-form">
      <h3>New Contract</h3>
      <input type="text" placeholder="Contract Name" bind:value={newContract.name} class:error={errorFields.name} required on:keypress={handleKeyPress} />
      <input type="number" placeholder="Contract ID" bind:value={newContract.id} class:error={errorFields.id} required on:keypress={handleKeyPress} />
      <input type="number" placeholder="Rate (Optional)" bind:value={newContract.rate} on:keypress={handleKeyPress} />
      <input type="text" placeholder="Address (Optional)" bind:value={newContract.address} on:keypress={handleKeyPress} />
      <input placeholder="Notes (Optional)" bind:value={newContract.notes} on:keypress={handleKeyPress}/>
      <button on:click={addContract}>Add Contract</button>
    </div>
  {/if} 
  

<!-- Tab Navigation -->
<div class="tabs">
  {#each contracts as contract, index}
    <button
      class="{selectedTabs.includes(index) ? 'active' : ''}"
      on:click={() => toggleTab(index)}
    >
      {contract.name}
    </button>
  {/each}
</div>

<!-- Chart Display -->
<div class="chart-container">
  {#if selectedTabs.length > 0}
    <div class="chart">
      <Bar {options} data={generateChartData(selectedTabs.map(index => contracts[index]))} />
    </div>
    <p class="chart-paragraph">
      This chart displays the data for the selected contracts. <strong>Hover over the bars</strong> to see detailed information. The x-axis represents the contract names, while the y-axis shows the contract values.
    </p>
  {:else}
    <p class="chart-paragraph">
      <strong>Waiting for Selection...</strong>
    </p>
  {/if}
</div>

</body>
</html>