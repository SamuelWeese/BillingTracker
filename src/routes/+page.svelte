<script>
    import { onMount } from "svelte";
    import Chart from 'chart.js/auto'; // Example for graphing
  
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
  
    // Function to add a new contract
    function addContract() {
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
    }
  
    // Toggle dropdown for contract details
    function toggleContractDetails(contract) {
      expandedContract = expandedContract === contract ? null : contract;
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
  
    onMount(() => {
      renderChart();
    });
  </script>
  
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
  </style>
  
  <h1>Contract Hours Tracker</h1>
  
  <table>
    <thead>
      <tr>
        <th>Contract</th>
        <th>Sunday</th>
        <th>Monday</th>
        <th>Tuesday</th>
        <th>Wednesday</th>
        <th>Thursday</th>
        <th>Friday</th>
        <th>Saturday</th>
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
        <td><button on:click={() => toggleContractDetails(contract)}>Toggle Details</button></td>
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
    </tbody>
  </table>
  
  <div class="center-buttons">
    <button on:click={() => showForm = true}>Add New Contract</button>
    <button on:click={exportAllContractsToCSV}>Export All Contracts</button>
  </div>
  
  {#if showForm}
    <div>
      <h3>New Contract Details</h3>
      <input type="text" placeholder="Contract Name" bind:value={newContract.name} required />
      <input type="number" placeholder="Contract ID" bind:value={newContract.id} required />
      <input type="number" placeholder="Rate (Optional)" bind:value={newContract.rate} />
      <input type="text" placeholder="Address (Optional)" bind:value={newContract.address} />
      <textarea placeholder="Notes (Optional)" bind:value={newContract.notes}></textarea>
      <button on:click={addContract}>Add Contract</button>
    </div>
  {/if}
  
  <h2>Graphs</h2>
  <canvas id="myChart" width="400" height="200"></canvas>
  