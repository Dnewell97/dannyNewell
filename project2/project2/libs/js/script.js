let searchableData = { staff: [], departments: [], locations: [] };
let personnelIcon = document.getElementById('personnelIcon');
let locationIcon = document.getElementById('locationIcon');
let departmentIcon = document.getElementById('departmentIcon');
let taskbarMiddle = document.getElementById('taskbar-middle');
let startButton = document.getElementById('start-button');
let startMenu = document.getElementById('start-menu');
let programTab;

const hideIcons = () => {
    personnelIcon.style.display = 'none';
    locationIcon.style.display = 'none';
    departmentIcon.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    const tableIcon = document.getElementById('tableIcon');
    const tableIconExtra = document.querySelectorAll('.icon-table');
    const companyDirectory = document.getElementById('companyDirectory');
    const maximizeButton = document.getElementById('maximizeButton');
    const taskbarMiddle = document.getElementById('taskbar-middle');

    // Create program tab
    programTab = document.createElement('div');
    programTab.id = 'programTab';
    programTab.textContent = 'Company Directory';

    // Maximize table
    const maximizeTable = () => {
        const tableContainers = document.getElementsByClassName('table-container');
        if (tableContainers.length > 0) {
            tableContainers[0].classList.toggle('larger');
        }
    };

    // Minimize company directory
    const showIcons = () => {
        personnelIcon.style.display = 'inline-block';
        locationIcon.style.display = 'inline-block';
        departmentIcon.style.display = 'inline-block';
    };

    hideIcons();

    const minimizeCompanyDirectory = () => {
        hideCompanyDirectory();
        hideIcons();
        programTab.style.backgroundColor = '';
        programTab.style.color = '';
    };

    // Toggle company directory
    const toggleCompanyDirectory = () => {
        if (companyDirectory.style.display === 'none') {
            // If company directory is closed, hide the icons
            showIcons();
        } else {
            // If company directory is open, show the icons
            hideIcons();
        }
        companyDirectory.style.display = companyDirectory.style.display === 'none' ? 'block' : 'none';
        programTab.style.backgroundColor = programTab.style.backgroundColor === '' ? '#EBEBEB' : '';
    };

    // Handle table icon click
    tableIcon.addEventListener('click', () => {
        companyDirectory.style.display = 'block';
      
        if (!taskbarMiddle.contains(programTab)) {
          taskbarMiddle.appendChild(programTab);
        }

      
        programTab.style.backgroundColor = '#C0C0C0';
        
        showIcons();
      
      });
    
      

    // Click handler for program tab
    programTab.addEventListener('click', toggleCompanyDirectory);

    // Minimize button click
    document.getElementById('minimizeButton').addEventListener('click', minimizeCompanyDirectory);

    // Maximize button click
    maximizeButton.addEventListener('click', maximizeTable);

    // Hide company directory
    const hideCompanyDirectory = () => {
        companyDirectory.style.display = 'none';
        hideIcons();
    };
});

const toggleStartMenu = () => {
    startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
};
// Ensure startButton is defined before adding event listeners
if (startButton) {
    startButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleStartMenu();
    });

    startButton.addEventListener('mouseover', () => {
        startButton.style.backgroundColor = '';
        startButton.style.color = 'white';
    });

    startButton.addEventListener('mouseout', () => {
        startButton.style.backgroundColor = '';
        startButton.style.color = '';
    });
}
// Close start menu if clicked outside of it or off the table
document.addEventListener('click', (event) => {
    const target = event.target;

    if (startMenu && !startMenu.contains(target) && target !== startButton && target !== programTab) {
        startMenu.style.display = 'none';
    }
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
    const hideCompanyDirectory = () => {
        companyDirectory.style.display = 'none';
        // hideExtraIcons();
      };
      const removeProgramTab = () => {
        if (taskbarMiddle.contains(programTab)) {
          taskbarMiddle.removeChild(programTab);
        }
    
      };
    const closeTable = () => {
        hideCompanyDirectory();
        removeProgramTab();
        hideIcons();
      };
      programTab = document.createElement('div');
    programTab.id = 'programTab';
    programTab.textContent = 'Company Directory';
  programTab.id = 'programTab';
  programTab.textContent = 'Company Directory';
    // Add a click event listener to the close button in the company directory
    document.getElementById('closeTableButton').addEventListener('click', closeTable);
    const toggleCompanyDirectory = () => {
        companyDirectory.style.display = companyDirectory.style.display === 'none' ? 'block' : 'none';
        programTab.style.backgroundColor = programTab.style.backgroundColor === '' ? '#C0C0C0' : '';
      };
   // Add program tab to the taskbar middle when the table icon is clicked
    tableIcon.addEventListener('click', toggleCompanyDirectory); 
    tableIcon.addEventListener('click', () => {
        toggleCompanyDirectory();
    
     //   Toggle the display of the program tab when table icon is clicked
        if (!taskbarMiddle.contains(programTab)) {
            taskbarMiddle.appendChild(programTab);
            toggleCompanyDirectory();
        }
    });
    


// function showModal(modalId) {
//     var modal = document.getElementById(modalId);
//     modal.style.display = 'block';
// }

// function closeModal(modalId) {
//     var modal = document.getElementById(modalId);
//     modal.style.display = 'none';
// }

// function toggleTable(tableId) {
//     var table = document.getElementById(tableId);
//     table.style.display = table.style.display === 'none' ? 'block' : 'none';
// }
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
// function scrollTable(direction) {
//     const tableContainer = document.getElementById('scrollableTable');
//     const scrollAmount = 50; // Adjust the scroll amount as needed
//     tableContainer.scrollTop += direction * scrollAmount;
//     updateTableFooter();
// }

function updateTableFooter() {
    const tableContainer = document.getElementById('scrollableTable');
    const tableFooter = document.getElementById('tableFooter');
    const totalRows = tableContainer.scrollHeight / 20; // Assuming each row is 20px in height
    const visibleRows = tableContainer.clientHeight / 20; // Assuming each row is 20px in height
    const currentPage = Math.ceil(tableContainer.scrollTop / 20) + 1; // Assuming each row is 20px in height
    tableFooter.textContent = `Record: ${currentPage} of ${totalRows}`;
}
// Add these functions to your existing script
// function toggleEditMenu() {
//     var editMenu = document.getElementById("editMenu");
//     editMenu.style.display = (editMenu.style.display === "block") ? "none" : "block";
// }

// function addEntry() {
//     // Add logic for adding an entry
//     console.log("Adding entry...");
// }

// function addLocation() {
//     // Add logic for adding a location
//     console.log("Adding location...");
// }

// function addDepartment() {
//     // Add logic for adding a department
//     console.log("Adding department...");
// }



  $(document).ready(() => {
    getAllEmployeeInfo();
});
