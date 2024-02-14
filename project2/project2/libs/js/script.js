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

const getAllDepartments = () => {
    $.ajax({
      type: "GET",
      url: "libs/php/getAllDepartments.php",
      dataType: "json",
      success: (response) => {
        let code = response.status.code;
        if (code === "200") {
          let departments = response.data;
  
          if (departments.length > 0) {
            // Get the select element
            let selectElement = document.getElementById('allDepartments');
  
            // Clear existing options
            selectElement.innerHTML = '';
  
            // Create and append new options
            departments.forEach(department => {
              let option = document.createElement('option');
              option.value = department.id;
              option.text = department.name;
              selectElement.appendChild(option);
            });
          } else {
            console.log('Could not load departments')
          }
        }
      },
      error: () => {
        console.log('Could not load departments');
      },
    });
  };

  const getLocation = () => {
    $.ajax({
      type: "GET",
      url: "libs/php/getAllLocation.php",
      dataType: "json",
      success: (response) => {
        let code = response.status.code;
        if (code === "200") {
          let locations = response.data;  // Change 'location' to 'locations' for consistency
  
          if (locations.length > 0) {
            // Get the select element
            let selectElement = document.getElementById('add-department-location');
  
            // Clear existing options
            selectElement.innerHTML = '';
  
            // Create and append new options
            locations.forEach(location => {
              let option = document.createElement('option');
              option.value = location.id;
              option.text = location.name;
              selectElement.appendChild(option);
            });
          } else {
            console.log('Could not load locations');  // Change 'location' to 'locations' for consistency
          }
        }
      },
      error: () => {
        console.log('Could not load locations');
      },
    });
  };

document.getElementById('personnelIcon').addEventListener('click', function() {
    // Show the Bootstrap Modal with the specified ID
    var modal = new bootstrap.Modal(document.getElementById('addPersonnel'));
    modal.show();
});

document.getElementById('departmentIcon').addEventListener('click', function() {
    var modal = new bootstrap.Modal (document.getElementById('addDepartment'));
    modal.show();
} );

document.getElementById('locationIcon').addEventListener('click', function() {
    var modal = new bootstrap.Modal (document.getElementById('addLocation'));
    modal.show();
} );


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
        content += `<td class="listItem" title="${employee.firstName} ${employee.lastName}" data-bs-toggle data-bs-target="#readOnlyForm" data-id="${employee.id}">${employee.firstName} ${employee.lastName}</td>`;
        content += `<td class="d-none d-sm-block">${employee.department}</td>`;
        content += `<td>${employee.location}</td>`;
        content += `<td><img src="libs/css/images/edit.png" alt="Edit" class="editIcon" data-id="${employee.id}"></td>`;
        content += `<td><img src="libs/css/images/delete.png" alt="Delete" class="deleteIcon" data-id="${employee.id}"></td>`;
        content += `</tr>`;
    }

    $("#employeesList").html(content);
};

function updateTable(foundData) {
    // Update your table with the found data
    populateEmployeeData(foundData);
}

function searchAll(searchText) {
    $.ajax({
      type: "GET",
      url: "libs/php/SearchAll.php",
      data: { txt: searchText },
      dataType: "json",
      success: function (response) {
        console.log('Response:', response); // Log the entire response object
        let code = response.status.code;
        if (code === "200") {
            let found = response.data.found;
            console.log('Found:', found);
  
          // Filter personnel data
          let personnelData = found.filter(
            (data) =>
              data.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
              data.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
              data.departmentName.toLowerCase().includes(searchText.toLowerCase())
          );
  
          console.log('Filtered personnelData:', personnelData);
  
          // Update the table with the filtered personnel data
          updateTable(personnelData);
  
          // Similar logic for departments and locations if needed
  
        } else {
          console.log('Query failed:', response.status.description);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error('Error during search:', textStatus, errorThrown);
      }
    });
  }
  
  // Handle input event for search
  $('#searchBarSearch').on('input', function () {
    let searchText = $(this).val();
    searchAll(searchText);
  });
  

function resetTable() {
    // Implement logic to reset the table to its original state
    // For example, reload all data or clear the table
    getAllEmployeeInfo();
    getAllDepartments();
    getLocation();
}

$(document).ready(() => {
    getAllEmployeeInfo();
    getAllDepartments();
    getLocation();
});
