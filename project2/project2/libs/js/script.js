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
    programTab.style.backgroundColor = '#EBEBEB';

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
          let locations = response.data;  
  
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



$(document).ready(() => {
    // Initial load

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
            complete: () => {
                // Ensure that the table is populated only after the data is fetched
                populateEmployeeData(searchableData["staff"]);
            }
        });
    };
    const getAllDepartmentInfo = () => {
        $.ajax({
            type: "POST",
            url: "libs/php/getAllDepartments.php",
            dataType: "json",
            success: (response) => {
                let code = response.status.code;
                if (code == "200") {
                    searchableData["department"] = response.data;
                    populateDepartmentData(response.data);
                }
            },
            error: (xhr, status, error) => {
                console.error("Error fetching data:", error);
                generateToast("Could not load employee data", "red");
            },
            complete: () => {
                // Ensure that the table is populated only after the data is fetched
                populateDepartmentData(searchableData["department"]);
            }
        });
    };
    const getAllLocationInfo = () => {
        $.ajax({
            type: "POST",
            url: "libs/php/getAllLocation.php",
            dataType: "json",
            success: (response) => {
                let code = response.status.code;
                if (code == "200") {
                    searchableData["location"] = response.data;
                    populateLocationData(response.data);
                }
            },
            error: (xhr, status, error) => {
                console.error("Error fetching data:", error);
                generateToast("Could not load employee data", "red");
            },
            complete: () => {
                // Ensure that the table is populated only after the data is fetched
                populateLocationData(searchableData["location"]);
            }
        });
    };
    
    // Example 1
    // Example 1
    const populateEmployeeData = (data) => {
        let content = "";
        for (let i = 0; i < data.length; i++) {
            const employee = data[i];
            content += `<tr>`;
            content += `<td class="listItem" title="${employee.firstName} ${employee.lastName}" data-bs-toggle data-bs-target="#readOnlyForm" data-id="${employee.id}">${employee.firstName} ${employee.lastName}</td>`;
            content += `<td class="d-none d-sm-block">${employee.department}</td>`;
            content += `<td>${employee.location}</td>`;
            content += `<td style="text-align:center"><a href="#" class="editButtonPersonnel" data-id="${employee.id}">
            <img src="libs/css/images/edit.png" alt="Edit" class="editIcon">
        </a>`;
            content += `<td style="text-align:center"><a href="#" class="deleteButtonPersonnel" data-id="${employee.id}"><img src="libs/css/images/delete.png" alt="Delete" class="deleteIcon" data-id="${employee.id}"></td>`;
            content += `</tr>`;
        }
    
        // Ensure that the #employeesList element exists
        const employeesList = $("#employeesList");
        if (employeesList.length) {
            employeesList.html(content);
        } else {
            console.error("#employeesList element not found!");
        }
    };

    const populateDepartmentData = (data) => {
        let content = "";
        for (let i = 0; i < data.length; i++) {
            const department = data[i];
            content += `<tr>`;
            content += `<td class="d-none d-sm-block">${department.name}</td>`;
            content += `<td>${department.location}</td>`;
            content += `<td style="text-align:center"><a href="#" class="editButtonDepartment" data-id="${department.id}"><img src="libs/css/images/edit.png" alt="Edit" class="editIcon"></td>`;
            content += `<td style="text-align:center"><a href="#" class="deleteButtonDepartment" data-id="${department.id}"><img src="libs/css/images/delete.png" alt="Delete" class="deleteIcon"></td>`;
            content += `</tr>`;
        }
    
        // Ensure that the #employeesList element exists
        const departmentList = $("#departmentList");
        if (departmentList.length) {
            departmentList.html(content);
        } else {
            console.error("#employeesList element not found!");
        }
    };
    
    const populateLocationData = (data) => {
        let content = "";
        for (let i = 0; i < data.length; i++) {
            const location = data[i];
            content += `<tr>`;
            content += `<td class="d-none d-sm-block">${location.name}</td>`;
            content += `<td style="text-align:center"><a href="#" class="editLocationPersonnel" data-id="${location.id}"><img src="libs/css/images/edit.png" alt="Edit" class="editIcon""></td>`;
            content += `<td style="text-align:center"><a href="#" class="deleteButtonPersonnel" data-id="${location.id}"><img src="libs/css/images/delete.png" alt="Delete" class="deleteIcon"></td>`;
            content += `</tr>`;
        }
    
        // Ensure that the #employeesList element exists
        const locationList = $("#locationList");
        if (locationList.length) {
            locationList.html(content);
        } else {
            console.error("#employeesList element not found!");
        }
    };

    function addDepartment() {
        // Get form data
        const departmentName = $('#add-department-name').val();
        const locationID = $('#add-department-location').val();
    
        // AJAX request to insertDepartment.php
        $.ajax({
            type: "GET",
            url: "libs/php/insertDepartment.php",
            data: { name: departmentName, locationID: locationID },
            dataType: "json",
            success: function (response) {
                console.log('Response:', response);
                if (response.status.code === "200") {
                    alert('Department added successfully!');
                    getAllDepartments();
                    // You can perform additional actions here if needed
                } else if (response.status.code === "400") {
                    alert('Failed to add department. Please try again.')
                } else if (response.status.code === "1062") {
                    alert('This department already exists');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error during department addition:', textStatus, errorThrown);
            }
        });
    }
        // Add an event listener for the form submission
        $('#createDepForm').submit(function (event) {
            // Prevent the default form submission behavior
            event.preventDefault();

            // Call the addDepartment function
            addDepartment();
            $('#addDepartment').modal('hide');
            
        });

        $('#addDepartment').on('hidden.bs.modal', function () {
            // Update the department list when the modal is closed
            getAllDepartments();
        });
        function addLocation() {
            // Get form data
            const locationName = $('#add-location-name').val();
        
            // AJAX request to insertLocation.php
            $.ajax({
                type: "GET",
                url: "libs/php/insertLocation.php",
                data: { name: locationName },
                dataType: "json",
                success: function (response) {
                    console.log('Response:', response);
                    if (response.status.code === "200") {
                        alert('Location added successfully!');
                        // Reload location list (if needed)
                        // You can perform additional actions here if needed
                    } else if (response.status.code === "400") {
                        alert('Failed to add location. Please try again.');
                    } else if (response.status.code === "1062") {
                        alert('This location already exists');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Error during location addition:', textStatus, errorThrown);
                }
            });
        }
        
        // Add an event listener for the form submission
        $('#createLocForm').submit(function (event) {
            // Prevent the default form submission behavior
            event.preventDefault();
        
            // Call the addLocation function
            addLocation();
            // Additional actions, if needed
        
            // Hide the modal
            $('#addLocation').modal('hide');
        });
        
        function addPersonnel() {
            // Get form data
            const firstName = $('#add-firstName').val();
            const lastName = $('#add-lastName').val();
            const jobTitle = $('#add-jobTitle').val();
            const email = $('#add-email').val();
            const departmentID = $('#allDepartments').val();
        
            // AJAX request to insertPersonnel.php
            $.ajax({
                type: "POST",
                url: "libs/php/insertPersonnel.php",
                data: { firstName: firstName, lastName: lastName, jobTitle: jobTitle, email: email, departmentID: departmentID },
                dataType: "json",
                success: function (response) {
                    console.log('Response:', response);
                    if (response.status.code === "200") {
                        alert('Personnel added successfully!');
                        // You can perform additional actions here if needed
                    } else if (response.status.code === "400") {
                        alert('Failed to add personnel. Please try again.');
                    } else if (response.status.code === "1062") {
                        alert('Duplicate entry: Personnel with the same details already exists.');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Error during personnel addition:', textStatus, errorThrown);
                }
            });
        }
        
        // Add an event listener for the form submission
        $('#addEmployeeForm').submit(function (event) {
            // Prevent the default form submission behavior
            event.preventDefault();
        
            // Call the addPersonnel function
            addPersonnel();
            // Additional actions, if needed
        
            // Hide the modal
            $('#addPersonnel').modal('hide');
        });

        // Function to open Edit Department Modal and load department data
// Add an event listener for the "Edit Department" button click
$('.editButtonDepartment').click(function(event) {
    // Prevent the default link behavior
    event.preventDefault();

    // Retrieve the department ID from the data attribute
    const departmentId = $(this).data('id');

    // AJAX request to get department data by ID
    $.ajax({
        type: "GET",
        url: "libs/php/getDepartmentByID.php",
        data: { id: departmentId },
        dataType: "json",
        success: function (response) {
            if (response.status.code === "200") {
                const departmentData = response.data[0];
                // Set values in the Edit Department Modal
                $('#edit-department-id').val(departmentData.id);
                $('#edit-department-name').val(departmentData.name);
                // Set selected option for location
                $('#edit-department-location').val(departmentData.locationID);
                // Open the Edit Department Modal
                $('#editDepartment').modal('show');
            } else {
                alert('Failed to fetch department data. Please try again.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error during department data fetching:', textStatus, errorThrown);
        }
    });
});


// Add an event listener for the Edit Department form submission
$('#editDepForm').submit(function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Call the updateDepartment function (you need to implement this)
    updateDepartment();
    
    // Close the Edit Department Modal
    $('#editDepartment').modal('hide');
});

$(document).on('click', '.editButtonPersonnel', function(event) {
    // Prevent the default link behavior
    event.preventDefault();

    // Retrieve the personnel ID from the data attribute
    const personnelId = $(this).data('id');

    // AJAX request to get personnel data by ID
    $.ajax({
        type: "GET",
        url: "libs/php/getPersonnelByID.php",
        data: { id: Number(personnelId) },
        dataType: "json",
        success: (response) => {
            if (response.status.code === "200") {
                const personnelData = response.data.personnel[0];

                // Set values in the Edit Personnel Modal
                $('#edit-personnel-id').val(personnelData.id);
                $('#edit-lastName').val(personnelData.lastName);
                $('#edit-firstName').val(personnelData.firstName);
                $('#edit-email').val(personnelData.email);
                $('#edit-jobTitle').val(personnelData.jobTitle);
                // Set selected option for department
                $('#edit-department').val(personnelData.departmentID);


                // Open the Edit Personnel Modal using Bootstrap's modal method
                $('#editPersonnel').modal('show');
                getAllDepartments();
            } else {
                alert('Failed to fetch personnel data. Please try again.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error during personnel data fetching:', textStatus, errorThrown);
        }
    });
});

        
    let activeTabId = "employee-tab"; // Declare globally

    $(".nav-link").click(function () {
        activeTabId = $(this).attr("id"); // Assign the global variable
        console.log('Active tab set:', activeTabId); // Add this line to log the active tab
    
    
        $(".data-table").hide(); // Hide all tables
    
        if (activeTabId === "employee-tab") {
            $("#employeesTable").show(); // Show Employees Table
            // Load Employees data
        } else if (activeTabId === "department-tab") {
            $("#departmentTable").show(); // Show Departments Table
            // Load Departments data
        } else if (activeTabId === "location-tab") {
            $("#locationTable").show(); // Show Locations Table
            // Load Locations data
        }
    });
    
    function searchAll(searchText) {
        if (!activeTabId) {
            console.error('Active tab not set.');
            return;
        }
    
        $.ajax({
            type: "GET",
            url: "libs/php/SearchAll.php",
            data: { txt: searchText, activeTab: activeTabId },
            dataType: "json",
            success: function (response) {
                console.log('Response:', response);
                let code = response.status.code;
                if (code === "200") {
                    let found = response.data.found;
    
                    if (searchText.trim()) {
                        // Filter data based on the active tab
                        let filteredData;
                        if (activeTabId === "employee-tab") {
                            filteredData = found.filter((data) =>
                                (data.firstName && data.firstName.toLowerCase().includes(searchText.toLowerCase())) ||
                                (data.lastName && data.lastName.toLowerCase().includes(searchText.toLowerCase())) ||
                                (data.department && data.department.toLowerCase().includes(searchText.toLowerCase())) ||
                                (data.location && data.location.toLowerCase().includes(searchText.toLowerCase()))
                            );
                        } else if (activeTabId === "department-tab") {
                            filteredData = found.filter((data) =>
                                (data.department && data.department.toLowerCase().includes(searchText.toLowerCase())) ||
                                (data.location && data.location.toLowerCase().includes(searchText.toLowerCase()))
                            );
                        } else if (activeTabId === "location-tab") {
                            filteredData = found.filter((data) =>
                                (data.name && data.name.toLowerCase().includes(searchText.toLowerCase()))
                            );
                        }
    
                        // Update the table with the filtered data
                        populateEmployeeData(filteredData);
                    } else {
                        // Update the table with all data
                        populateEmployeeData(found);
                    }
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
    
    // function resetTable() {
    //     // Implement logic to reset the table to its original state
    //     // For example, reload all data or clear the table
    //     getAllEmployeeInfo();
    //     getAllDepartments();
    //     getAllLocation();
    // }

    getAllEmployeeInfo();
    getAllDepartmentInfo();
    getAllLocationInfo();
    getAllDepartments();
    getLocation();

});
