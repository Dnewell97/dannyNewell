let searchableData = { staff: [], departments: [], locations: [] };
document.addEventListener('DOMContentLoaded', () => {
    const tableIcon = document.getElementById('tableIcon');
    const tableIconExtra = document.querySelectorAll('.icon-table');
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const companyDirectory = document.getElementById('companyDirectory');
    const maximizeButton = document.getElementById('maximizeButton');
    const taskbarMiddle = document.getElementById('taskbar-middle');

    // Create the program tab for Company Directory
    const programTab = document.createElement('div');
    programTab.id = 'programTab';
    programTab.textContent = 'Company Directory';

    // Function to hide the extra icons
    const hideExtraIcons = () => {
        tableIconExtra.forEach(icon => {
            icon.style.display = 'none';
        });
    };

    // Function to handle the closing of the table
    const closeTable = () => {
        console.log('Close button clicked');
        hideCompanyDirectory();
        removeProgramTab();
    };

    // Function to maximize the table
    const maximizeTable = () => {
        const tableContainers = document.getElementsByClassName('table-container');

        // Check if any elements with the specified class are found
        if (tableContainers.length > 0) {
            // Toggle the class on the first element in the collection
            tableContainers[0].classList.toggle('larger');
        }
    };

    // Function to minimize the company directory
    const minimizeCompanyDirectory = () => {
        console.log('Minimize button clicked');
        hideCompanyDirectory();
        programTab.style.backgroundColor = '#000080'; // Set tab color when minimized
        programTab.style.color='#FFFFFF'
    };

    // Function to toggle the display of the company directory
    const toggleCompanyDirectory = () => {
        if (companyDirectory.style.display === 'block') {
            companyDirectory.style.display = 'none';
            programTab.style.backgroundColor = ''; // Reset tab color when closed
        } else {
            companyDirectory.style.display = 'block';
            programTab.style.backgroundColor = '#C0C0C0';
            programTab.style.color='#000000' // Set tab color when opened
        }
    };

    // Click event for program tab
    programTab.addEventListener('click', () => {
        toggleCompanyDirectory();
    });

    // Event listener for the minimize button
    document.getElementById('minimizeButton').addEventListener('click', minimizeCompanyDirectory);

    // Event listener for the maximize button
    maximizeButton.addEventListener('click', maximizeTable);

    // Function to hide the company directory
    const hideCompanyDirectory = () => {
        companyDirectory.style.display = 'none';
        hideExtraIcons();
    };

    // Function to remove the program tab
    const removeProgramTab = () => {
        if (taskbarMiddle.contains(programTab)) {
            taskbarMiddle.removeChild(programTab);
        }
    };

    // Function to toggle the start menu display
    const toggleStartMenu = () => {
        startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
        hideCompanyDirectory();
        removeProgramTab();
    };

    // Add a click event listener to the start button
    startButton.addEventListener('click', () => {
        console.log('Start button clicked');
        toggleStartMenu();
    });

    // Close start menu if clicked outside of it or off the table
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!startMenu.contains(target) && target !== startButton && !companyDirectory.contains(target) && target !== programTab) {
            startMenu.style.display = 'none';
            hideCompanyDirectory();
        }
    });

    // Handle hover effect on start button
    startButton.addEventListener('mouseover', () => {
        startButton.style.backgroundColor = '#080808';
        startButton.style.color = 'white';
    });

    startButton.addEventListener('mouseout', () => {
        startButton.style.backgroundColor = '';
        startButton.style.color = '';
    });

    // Handle hover effect on start menu items
    const startMenuItems = document.querySelectorAll('.start-menu-item');
    startMenuItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            item.style.backgroundColor = '#080808';
            item.style.color = 'white';
        });

        item.addEventListener('mouseout', () => {
            item.style.backgroundColor = '';
            item.style.color = '';
        });
    });

    // Add a click event listener to the close button in the company directory
    document.getElementById('closeTableButton').addEventListener('click', closeTable);

    // Add program tab to the taskbar middle when the table icon is clicked
    tableIcon.addEventListener('click', () => {
        toggleCompanyDirectory();
        // Toggle the display of the program tab when table icon is clicked
        if (!taskbarMiddle.contains(programTab)) {
            taskbarMiddle.appendChild(programTab);
            toggleCompanyDirectory();
        }

    });
});


function showModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = 'block';
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function toggleTable(tableId) {
    var table = document.getElementById(tableId);
    table.style.display = table.style.display === 'none' ? 'block' : 'none';
}
function updateDateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    document.getElementById('date-time').textContent = `${timeString}`;
}

// Update time every second
setInterval(updateDateTime, 1000);

// Initial update
updateDateTime();


  const getAllEmployeeInfo = () => {
    $.ajax({
        type: "POST",
        url: "libs/php/getAll.php",
        dataType: "json",
        success: (response) => {
            let code = response.status.code;
            if (code == "200") {
                searchableData["staff"] = response.data;
                populateEmployeeData(response.data);
            }
        },
        error: (xhr, status, error) => {
            console.error("Error fetching data:", error);
            generateToast("Could not load employee data", "red");
        },
    });
};

// Populating tables functions
const populateEmployeeData = (data) => {
    let content = "";
    for (let i = 0; i < data.length; i++) {
      const employee = data[i];
      content += `<tr>`;
      content += `<td class="listItem" title="${employee.firstName} ${employee.lastName}" data-bs-toggle="modal" data-bs-target="#readOnlyForm" data-id="${employee.id}">${employee.firstName} ${employee.lastName}</td>`;
      content += `<td class="d-none d-sm-block">${employee.department}</td>`;
      content += `<td>${employee.location}</td>`;
      content += `</tr>`;
    }
  
    $("#employeesList").html(content);
  };

// Add this function to your script.js
function scrollTable(direction) {
    const tableContainer = document.getElementById('scrollableTable');
    const scrollAmount = 50; // Adjust the scroll amount as needed
    tableContainer.scrollTop += direction * scrollAmount;
    updateTableFooter();
}

function updateTableFooter() {
    const tableContainer = document.getElementById('scrollableTable');
    const tableFooter = document.getElementById('tableFooter');
    const totalRows = tableContainer.scrollHeight / 20; // Assuming each row is 20px in height
    const visibleRows = tableContainer.clientHeight / 20; // Assuming each row is 20px in height
    const currentPage = Math.ceil(tableContainer.scrollTop / 20) + 1; // Assuming each row is 20px in height
    tableFooter.textContent = `Record: ${currentPage} of ${totalRows}`;
}
// Add these functions to your existing script
function toggleEditMenu() {
    var editMenu = document.getElementById("editMenu");
    editMenu.style.display = (editMenu.style.display === "block") ? "none" : "block";
}

function addEntry() {
    // Add logic for adding an entry
    console.log("Adding entry...");
}

function addLocation() {
    // Add logic for adding a location
    console.log("Adding location...");
}

function addDepartment() {
    // Add logic for adding a department
    console.log("Adding department...");
}



  $(document).ready(() => {
    getAllEmployeeInfo();
});
