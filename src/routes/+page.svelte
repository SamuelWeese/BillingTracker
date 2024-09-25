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
  :root {
    /* Default theme */
    --border-color: #1eff00;
    --background-light: #f4f4f4;
    --background-dark: #f9f9f9;
    --text-color: #333;
    --highlight-color: #f0f0f0;
    --error-color: red;
  }

  /* Make font size scale with viewport width */
  body {
    font-size: 1.5vw; /* Adjusts font size based on viewport width */
  }

  /* Table styles */
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid var(--border-color);
    padding: 1vw; /* Padding scales with viewport width */
  }

  th {
    background-color: var(--background-light);
    cursor: pointer;
  }

  th .sort-arrow {
    margin-left: 0.5vw;
    font-size: 0.8em; /* Keep font size for the sort arrow relative */
  }

  .center-buttons {
    text-align: center;
    margin: 2vw; /* Margin scales with viewport width */
  }

  .contract-details {
    padding: 1vw;
    background-color: var(--background-dark);
    border: 1px solid var(--highlight-color);
    margin-bottom: 1vw;
  }

  .total-row {
    background-color: var(--highlight-color);
    font-weight: bold;
  }

  /* Form styles */
  .contract-form input,
  .contract-form textarea {
    display: block;
    margin-bottom: 1vw;
    font-size: 1.5vw; /* Scales with viewport width */
    padding: 1vw;
    width: 100%; /* Make sure the input fields stretch across */
    box-sizing: border-box; /* Ensures padding doesn’t break the width */
  }

  .error {
    border: 0.2vw solid var(--error-color); /* Scale border thickness */
    animation: flash 0.5s linear infinite alternate;
  }

  @keyframes flash {
    0% { border-color: var(--error-color); }
    100% { border-color: transparent; }
  }
  .tabs button {
    padding: 10px;
    margin-right: 10px;
    cursor: pointer;
  }

  .tabs .active {
    font-weight: bold;
  }

  .chart {
    margin-top: 20px;
    width: 100%;
    height: 400px;
  }
</style>






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
          <button on:click={() => toggleContractDetails(contract)}>Details</button> 
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
<div class="chart">
  {#if selectedTabs.length > 0}
    <Bar {options} data={generateChartData(selectedTabs.map(index => contracts[index]))} />
  {:else}
    <p>Select a contract to view the chart</p>
  {/if}
</div>