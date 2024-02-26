let searchableData = { staff: [], departments: [], locations: [] };
let personnelIcon = document.getElementById('personnelIcon');
let locationIcon = document.getElementById('locationIcon');
let departmentIcon = document.getElementById('departmentIcon');
let taskbarMiddle = document.getElementById('taskbar-middle');
let startButton = document.getElementById('start-button');
let startMenu = document.getElementById('start-menu');
let programTab;
let currentSearchText = '';
const hideIcons = () => {
    personnelIcon.style.display = 'none';
    locationIcon.style.display = 'none';
    departmentIcon.style.display = 'none';
};
function showAlertModal(type, message) {
    var imagePath;
    switch (type) {
        case 'success':
            imagePath = 'libs/css/images/success.png';
            break;
        case 'restrict':
            imagePath = 'libs/css/images/restrict.png'; 
            break;
        case 'warning':
            imagePath = 'libs/css/images/warning.png'; 
            break;
        default:
            imagePath = ''; // no image or a default image path
    }

    var alertImage = document.getElementById('alertImage');
    var alertText = document.getElementById('alertModalText');

    // Only set the src and display the image if the imagePath is not empty
    if (imagePath) {
        alertImage.src = imagePath;
        alertImage.style.display = 'inline'; // or 'block', depending on your layout
    } else {
        alertImage.style.display = 'none';
    }

    // Set the message text
    alertText.textContent = message;

    // Show the modal
    var alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
    alertModal.show();
}


document.addEventListener('DOMContentLoaded', () => {
    const tableIcon = document.getElementById('tableIcon');
    const companyDirectory = document.getElementById('companyDirectory');
    const maximizeButton = document.getElementById('maximizeButton');


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

const populateDepartmentSelectElements = () => {
    $.ajax({
        type: "GET",
        url: "libs/php/getAllDepartments.php",
        dataType: "json",
        success: (response) => {
            if (response.status.code === "200") {
                let departments = response.data;

                if (departments.length > 0) {
                    let selectElementAdd = document.getElementById('add-departments');
                    let selectElementEdit = document.getElementById('allDepartments');

                    // Clear existing options in both select elements
                    selectElementAdd.innerHTML = '';
                    selectElementEdit.innerHTML = '';

                    // Create and append new options to both select elements
                    departments.forEach(department => {
                        let optionAdd = document.createElement('option');
                        optionAdd.value = department.id;
                        optionAdd.text = department.name;
                        selectElementAdd.appendChild(optionAdd);

                        let optionEdit = optionAdd.cloneNode(true); // Clone the option for the other select
                        selectElementEdit.appendChild(optionEdit);
                    });
                }
            }
        },
        error: () => {
            console.error('Error loading departments');
            // Optionally handle the error
        }
    });
};

// Call this function when you need to populate the department select elements
populateDepartmentSelectElements();

const populateLocationSelectElements = () => {
    $.ajax({
        type: "GET",
        url: "libs/php/getAllLocation.php",
        dataType: "json",
        success: (response) => {
            if (response.status.code === "200") {
                let locations = response.data;

                if (locations.length > 0) {
                    let selectElementAdd = document.getElementById('add-department-location');
                    let selectElementEdit = document.getElementById('edit-department-location');

                    // Clear existing options in both select elements
                    selectElementAdd.innerHTML = '';
                    selectElementEdit.innerHTML = '';

                    // Create and append new options to both select elements
                    locations.forEach(location => {
                        let optionAdd = document.createElement('option');
                        optionAdd.value = location.id;
                        optionAdd.text = location.name;
                        selectElementAdd.appendChild(optionAdd);

                        let optionEdit = optionAdd.cloneNode(true); // Clone the option for the other select
                        selectElementEdit.appendChild(optionEdit);
                    });
                }
            }
        },
        error: () => {
            console.error('Error loading locations');
            // Optionally handle the error
        }
    });
};

// Call this function when you need to populate the location select elements
populateLocationSelectElements();


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


   

        // Function to open Edit Department Modal and load department data
// Add an event listener for the "Edit Department" button click



const updateFooterOnHover = () => {
    // First, remove any existing hover events to avoid duplicates
    $("#employeesList tr, #departmentList tr, #locationList tr").off('mouseenter mouseleave');

    // Apply hover event based on the active tab
    $('.nav-link.active').each(function() {
        let activeTabId = $(this).attr('id');
        let tableSelector;

        switch (activeTabId) {
            case 'employee-tab':
                tableSelector = '#employeesList tr';
                break;
            case 'department-tab':
                tableSelector = '#departmentList tr';
                break;
            case 'location-tab':
                tableSelector = '#locationList tr';
                break;
        }

        $(tableSelector).hover(function() {
            let index = $(this).index() + 1; // Index is zero-based
            let total = $(tableSelector).length;
            $(".footer").text(`Record: ${index} of ${total}`);
        }, function() {
            let total = $(tableSelector).length;
            $(".footer").text(`Record: 1 of ${total}`);
        });
    });
};

const bindHoverEvents = (tableSelector) => {
    $(`${tableSelector} tr`).hover(function() {
        let index = $(this).index() + 1; // Index is zero-based
        let total = $(`${tableSelector} tr`).length;
        $(".footer").text(`Record: ${index} of ${total}`);
    }, function() {
        let total = $(`${tableSelector} tr`).length;
        $(".footer").text(`Record: 1 of ${total}`);
    });
};



$(document).ready(() => {
    const getAllEmployeeInfo = (updateInitialFooter) => {
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
            },
            complete: () => {
                // Ensure that the table is populated only after the data is fetched
                populateEmployeeData(searchableData["staff"]);
                if (typeof updateInitialFooter === "function") {
                    updateInitialFooter(); // Execute the callback function
                }
            }
        });
    };
    
    const getAllDepartmentInfo = (updateInitialFooter) => {
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
                generateToast("Could not load department data", "red");
            },
            complete: () => {
                // Ensure that the table is populated only after the data is fetched
                populateDepartmentData(searchableData["department"]);
                if (typeof updateInitialFooter === "function") {
                    updateInitialFooter(); // Execute the callback function
                }
            }
        });
    };
    
    const getAllLocationInfo = (updateInitialFooter) => {
        $.ajax({
            type: "POST",
            url: "libs/php/getAllLocation.php",
            dataType: "json",
            success: (response) => {
                let code = response.status.code;
                if (code == "200") {
                    searchableData["location"] = response.data;
                    populateLocationData(response.data);
    
                    if (response.data.length > 0) {
                        // Get the select element
                        let selectElement = document.getElementById('add-department-location');
    
                        // Clear existing options
                        selectElement.innerHTML = '';
    
                        // Create and append new options
                        response.data.forEach(location => {
                            let option = document.createElement('option');
                            option.value = location.id;
                            option.text = location.name;
                            selectElement.appendChild(option);
                        });
                    } else {
                        console.log('Could not load locations');
                    }
                }
            },
            error: (xhr, status, error) => {
                console.error("Error fetching data:", error);
                generateToast("Could not load location data", "red");
            },
            complete: () => {
                // Ensure that the table is populated only after the data is fetched
                populateLocationData(searchableData["location"]);
                if (typeof updateInitialFooter === "function") {
                    updateInitialFooter(); // Execute the callback function
                }
            }
        });
    };
    
    
    // Example 1

        const populateEmployeeData = (data) => {
            let content = "";
            // console.log("Populating employee data:", data); 
            let tableBody = $("#employeesList");
            tableBody.empty();
            
            for (let i = 0; i < data.length; i++) {
                const employee = data[i];
                content += `<tr data-index="${i + 1}">`;
            content += `<td class="listItem" title="${employee.firstName} ${employee.lastName}" data-bs-toggle data-bs-target="#readOnlyForm" data-id="${employee.id}">${employee.firstName} ${employee.lastName}</td>`;
            content += `<td class="d-none d-sm-table-cell">${employee.department}</td>`;
            content += `<td class="d-none d-sm-table-cell" >${employee.location}</td>`;
            content += `<td class="w-12" style="text-align:center"><a href="#" class="editButtonPersonnel" data-id="${employee.id}">
            <img src="libs/css/images/edit.png" alt="Edit" class="editIcon">
        </a>`;
            content += `<td class="w-12" style="text-align:center"><a href="#" class="deleteButtonPersonnel" data-id="${employee.id}"><img src="libs/css/images/delete.png" alt="Delete" class="deleteIcon" data-id="${employee.id}"></td>`;
            content += `</tr>`;
            }
        
            tableBody.html(content);
        
            // console.log("Employee table updated. Current rows:", tableBody.children().length);
            updateFooterOnHover();
            updateInitialFooter();
            bindHoverEvents("#employeeList")
        };
        

    const populateDepartmentData = (data) => {
        // console.log("Populating department data:", data);
        let tableBody = $("#departmentList");
        tableBody.empty(); // Clear existing rows
    
        let content = "";
        for (let i = 0; i < data.length; i++) {
            const department = data[i];
            let departmentName = department.department || department.name;
            content += `<tr data-index="${i + 1}">`;
            content += `<td class="listItem">${departmentName}</td>`;
            content += `<td class="d-none d-sm-table-cell">${department.location}</td>`;
            content += `<td class="w-12" style="text-align:center"><a href="#" class="editButtonDepartment" data-id="${department.id}"><img src="libs/css/images/edit.png" alt="Edit" class="editIcon"></td>`;
            content += `<td class="w-12" style="text-align:center"><a href="#" class="deleteButtonDepartment" data-id="${department.id}"><img src="libs/css/images/delete.png" alt="Delete" class="deleteIcon"></td>`;
            content += `</tr>`;
        }
    
        // Append the generated content to the table body
        tableBody.html(content);
    
        // console.log("Department table updated. Current rows:", tableBody.children().length); 
    
        // Update the footer after the table is populated
            updateFooterOnHover();
            updateInitialFooter();
            bindHoverEvents('#departmentList')
    };
    
        // // Ensure that the #employeesList element exists
        // const departmentList = $("#departmentList");
        // updateFooterOnHover();
        // updateFooterText();
        // if (departmentList.length) {
        //     departmentList.html(content);
        // } else {
        //     console.error("#employeesList element not found!");
        // }


    const populateLocationData = (data) => {
        let content = "";
        // console.log("Populating location data:", data);
        let tableBody = $("#locationList");
        tableBody.empty();
        
        for (let i = 0; i < data.length; i++) {
            const location = data[i];
            content += `<tr data-index="${i + 1}">`;
            content += `<td class="listItem">${location.name}</td>`;
            content += `<td class="w-12" style="text-align:center"><a href="#" class="editLocation" data-id="${location.id}"><img src="libs/css/images/edit.png" alt="Edit" class="editIcon""></td>`;
            content += `<td class="w-12" style="text-align:center"><a href="#" class="deleteLocation" data-id="${location.id}"><img src="libs/css/images/delete.png" alt="Delete" class="deleteIcon"></td>`;
            content += `</tr>`;
        }
    
        tableBody.html(content);
    
        // console.log("Location table updated. Current rows:", tableBody.children().length); 
        updateFooterOnHover();
        updateInitialFooter();
        bindHoverEvents('#locationList')
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
                    if (response.status.code === "200") {
                        showAlertModal('success', 'Department added successfully!');
                        // ...
                    } else if (response.status.code === "400") {
                        showAlertModal('restrict', 'Failed to add department. Please try again.');
                        // ...
                    } else if (response.status.code === "1062") {
                        showAlertModal('restrict', 'This department already exists.');
                        // ...
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
            getAllDepartmentInfo();
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
                        showAlertModal('success','Location added successfully!');
                        getAllLocationInfo();
                    } else if (response.status.code === "400") {
                        showAlertModal('restrict','Failed to add location. Please try again.');
                    } else if (response.status.code === "1062") {
                        showAlertModal('restrict','This location already exists');
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
            getAllLocationInfo();
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
                        showAlertModal('success','Personnel added successfully!');
                        // You can perform additional actions here if needed
                    } else if (response.status.code === "400") {
                        showAlertModal('restrict','Failed to add personnel. Please try again.');
                    } else if (response.status.code === "1062") {
                        showAlertModal('restrict','Duplicate entry: Personnel with the same details already exists.');
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

// AJAX call to get personnel data by ID and populate the edit modal
$(document).on('click', '.editButtonPersonnel', function(event) {
    event.preventDefault();
    const personnelId = $(this).data('id');

    $.ajax({
        type: "GET",
        url: "libs/php/getPersonnelByID.php",
        data: { id: Number(personnelId) },
        dataType: "json",
        success: (response) => {
            if (response.status.code === "200") {
                const personnelData = response.data.personnel[0];

                // Populate the Edit Personnel Modal
                $('#edit-personnel-id').val(personnelData.id);
                $('#edit-lastName').val(personnelData.lastName);
                $('#edit-firstName').val(personnelData.firstName);
                $('#edit-email').val(personnelData.email);
                $('#edit-jobTitle').val(personnelData.jobTitle);
                $('#allDepartments').val(personnelData.departmentID); // Correct the ID here

                $('#editPersonnel').modal('show');
            } else {
                showAlertModal('restrict','Failed to fetch personnel data. Please try again.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error during personnel data fetching:', textStatus, errorThrown);
        }
    });
});

// Update personnel function
function updatePersonnel(updatedData) {
    $.ajax({
        type: "GET",
        url: "libs/php/updatePersonnel.php",
        data: updatedData,
        dataType: "json",
        success: function (response) {
            if (response.status.code === "200") {
                showAlertModal('success','Personnel updated successfully!');
                $('#editPersonnel').modal('hide');
            } else {
                showAlertModal('restrict','Failed to update personnel. Please try again.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('AJAX Error', {
                textStatus: textStatus,
                errorThrown: errorThrown,
                jqXHR: jqXHR
            });
        }
    });
}

// Bind to form submit instead of button click
$('#editPersonnelForm').submit(function (event) {
    event.preventDefault();

    const updatedData = {
        id: $('#edit-personnel-id').val(),
        lastName: $('#edit-lastName').val(),
        firstName: $('#edit-firstName').val(),
        email: $('#edit-email').val(),
        jobTitle: $('#edit-jobTitle').val(),
        departmentID: $('#allDepartments').val() // Correct the ID here
    };
    console.log('Sending data:', updatedData);

    updatePersonnel(updatedData);
});
$(document).on('click', '.editButtonDepartment', function(event) {
    event.preventDefault();

    // Using jQuery to retrieve the data-id attribute
    const departmentId = $(this).data('id');
    console.log("Clicked Department ID:", departmentId);

    if (departmentId) {
        $.ajax({
            type: "GET",
            url: "libs/php/getDepartmentByID.php",
            data: { id: Number(departmentId) },
            dataType: "json",
            success: function(response) {
                // Process the response...
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error during department data fetching:', textStatus, errorThrown);
            }
        });
    } else {
        console.error('Department ID is undefined.');
    }
});

        // $(document).on('click', '.editButtonDepartment', function(event) {
        //     event.preventDefault();
        //     const departmentId = $(this).data('id');
        //     console.log("Department ID:", departmentId);
        
        //     $.ajax({
        //         type: "GET",
        //         url: "libs/php/getDepartmentByID.php",
        //         data: { id: departmentId },
        //         dataType: "json",
        //         success: function(response) {
        //             if (response.status.code === "200") {
        //                 const departmentData = response.data[0];
        //                 $('#edit-department-id').val(departmentData.id);
        //                 $('#edit-department-name').val(departmentData.name);
        //                 $('#edit-department-location').val(departmentData.locationID);
        //                 $('#editDepartment').modal('show');
        //             } else {
        //                 showAlertModal('restrict','Failed to fetch department data. Please try again.');
        //             }
        //         },
        //         error: function(jqXHR, textStatus, errorThrown) {
        //             console.error('Error during department data fetching:', textStatus, errorThrown);
        //         }
        //     });
        // });
        function updateDepartment(departmentData) {
            $.ajax({
                type: "GET",
                url: "libs/php/updateDepartment.php",
                data: departmentData,
                dataType: "json",
                success: function(response) {
                    console.log(response);
                        if (response.status.code === "200") {
                            showAlertModal('success', 'Department updated successfully!');
                            getAllDepartmentInfo();
                        } else if (response.status.code === "409") {
                            showAlertModal('restrict', 'Department with this name already exists.');
                        } else {
                            showAlertModal('restrict', 'Failed to update department. Please try again.');
                        }
                    },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('Error during department update:', textStatus, errorThrown);
                }
            });
        }
        
        $('#editDepForm').submit(function(event) {
            event.preventDefault();
            const updatedData = {
                id: $('#edit-department-id').val(),
                name: $('#edit-department-name').val(),
                locationID: $('#edit-department-location').val()
            };
            updateDepartment(updatedData);
            $('#editDepartment').modal('hide');
        });
        
        $(document).on('click', '.editLocation', function(event) {
            event.preventDefault();
            const locationId = $(this).data('id');
        
            $.ajax({
                type: "GET",
                url: "libs/php/getLocationByID.php",
                data: { id: locationId },
                dataType: "json",
                success: function(response) {
                    if (response.status.code === "200" && response.data.length > 0) {
                        const locationData = response.data[0];
                        $('#edit-location-id').val(locationData.id);
                        $('#edit-location-name').val(locationData.name);
        
                        // Open the modal
                        $('#editLocation').modal('show');
                    } else {
                        showAlertModal('restrict','Failed to fetch location data. Please try again.');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('Error during location data fetching:', textStatus, errorThrown);
                }
            });
        });
        
        function updateLocation(locationData) {
            $.ajax({
                type: "POST",
                url: "libs/php/updateLocation.php",
                data: locationData,
                dataType: "json",
                success: function(response) {
                    if (response.status.code === "200") {
                        showAlertModal('success','Location updated successfully!');
                        getAllLocationInfo();
                        // You might want to refresh your location data on the page here
                    } else {
                        showAlertModal('restrict','Failed to update location. Please try again.');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('Error during location update:', textStatus, errorThrown);
                }
            });
        }
        
        $('#editLocationForm').submit(function(event) {
            event.preventDefault();
            const updatedData = {
                id: $('#edit-location-id').val(),
                name: $('#edit-location-name').val()
            };
            updateLocation(updatedData);
            $('#editLocation').modal('hide');
        });
        

        // Open the delete personnel modal
$(document).on('click', '.deleteButtonPersonnel', function(event) {
    event.preventDefault();
    const personnelId = $(this).data('id');
    $('#delete-personnel-id').val(personnelId); // Set the personnel ID in the modal's hidden input
    $('#deletePersonnel').modal('show'); // Show the modal
});

// Open the delete department modal
$(document).on('click', '.deleteButtonDepartment', function(event) {
    event.preventDefault();
    const departmentId = $(this).data('id');
    $('#delete-department-id').val(departmentId); // Set the department ID in the modal's hidden input
    $('#deleteDepartment').modal('show'); // Show the modal
});

// Open the delete location modal
$(document).on('click', '.deleteLocation', function(event) {
    event.preventDefault();
    const locationId = $(this).data('id');
    $('#delete-location-id').val(locationId); // Set the location ID in the modal's hidden input
    $('#deleteLocation').modal('show'); // Show the modal
});

// Handle form submission for deleting personnel
$('#deletePersonnelForm').submit(function(event) {
    event.preventDefault();
    const id = $('#delete-personnel-id').val();
    deletePersonnel(id);
    getAllEmployeeInfo();
    searchAll('');
    $('#deletePersonnel').modal('hide');
});

// Handle form submission for deleting department
$('#deleteDepartmentForm').submit(function(event) {
    event.preventDefault();
    const id = $('#delete-department-id').val();
    deleteDepartment(id);
    getAllDepartmentInfo();
    searchAll('');
    $('#deleteDepartment').modal('hide');
});

// Handle form submission for deleting location
$('#deleteLocationForm').submit(function(event) {
    event.preventDefault();
    const id = $('#delete-location-id').val();
    deleteLocation(id);
    searchAll('');
    getAllLocationInfo();
    $('#deleteLocation').modal('hide');
});



function deletePersonnel(id) {
        $.ajax({
            type: "POST",
            url: "libs/php/deletePersonnelByID.php",
            data: { id: id },
            dataType: "json",
            success: function(response) {
                if (response.status.code === "200") {
                    showAlertModal('success','Personnel deleted successfully!');
                    getAllEmployeeInfo();
                } else {
                    showAlertModal('restrict','Failed to delete personnel.');
                }
            },
            error: function() {
                showAlertModal('restrict','Error occurred while deleting personnel.');
            }
        });
    }
function deleteDepartment(id) {
        $.ajax({
            type: "POST",
            url: "libs/php/deleteDepartmentByID.php",
            data: { id: id },
            dataType: "json",
            success: function(response) {
                if (response.status.code === "200") {
                    showAlertModal('success','Department deleted successfully!');
                    getAllDepartmentInfo();
                } else if (response.status.code === "409") {
                    showAlertModal('restrict','Cannot delete department as it has assigned personnel.');
                } else {
                    showAlertModal('restrict','Failed to delete department.');
                }
            },
            error: function() {
                showAlertModal('restrict','Error occurred while deleting department.');
            }
        });
    }
function deleteLocation(id) {
        $.ajax({
            type: "POST",
            url: "libs/php/deleteLocationByID.php",
            data: { id: id },
            dataType: "json",
            success: function(response) {
                if (response.status.code === "200") {
                    showAlertModal('success','Location deleted successfully!');
                    getAllLocationInfo();
                } else if (response.status.code === "409") {
                    showAlertModal('restrict','Cannot delete location as it has associated departments.');
                } else {
                    showAlertModal('restrict','Failed to delete location.');
                }
            },
            error: function() {
                showAlertModal('restrict','Error occurred while deleting location.');
            }
        });
    }

       
        
        let activeTabId = "employee-tab"; // Declare globally
        $(".nav-link").click(function () {
            activeTabId = $(this).attr("id");
            searchAll(''); // Clear the search results
            $(".data-table").hide(); // Hide all tables
            // Reset search bar
    $('#searchBarSearch').val('');
    fetchAllDataForTab(activeTabId);
    currentSearchText = '';
             if (activeTabId === "employee-tab") {
                $("#employeesTable").show()
            } else if (activeTabId === "department-tab") {
                $("#departmentTable").show()
            } else if (activeTabId === "location-tab") {
                $("#locationTable").show()
            }
        });

        const updateInitialFooter = () => {
            // Determine the active tab directly
            let activeTab = $('.nav-link.active').attr('id');
        
            // Based on the active tab, select the correct table
            let tableId;
            switch (activeTab) {
                case 'employee-tab':
                    tableId = '#employeesList';
                    break;
                case 'department-tab':
                    tableId = '#departmentList';
                    break;
                case 'location-tab':
                    tableId = '#locationList';
                    break;
                default:
                    console.log('Unknown active tab');
                    return; // Exit the function if no known tab is active
            }
        
            // Now, update the footer based on the selected table
            let total = $(`${tableId} tr`).length;
            // console.log(`Updating footer for ${activeTab}: ${total} rows found`); 
            $(".footer").text(`Record: 1 of ${total}`);
        };
        
        

        // const updateFooterText = () => {
        //     // Update footer text based on the current number of rows in the active table
        //     let total = $(`#${activeTabId}List tr`).length;
        //     $(".footer").text(`Record: 1 of ${total}`);
        // };
        
        
        

        function fetchAllDataForTab(tabId) {
        
        
            if (tabId === "employee-tab") {
                getAllEmployeeInfo(updateInitialFooter);
            } else if (tabId === "department-tab") {
                getAllDepartmentInfo(updateInitialFooter);
            } else if (tabId === "location-tab") {
                getAllLocationInfo(updateInitialFooter);
            }
        
        }
        

        function searchAll(searchText) {
            currentSearchText = searchText;
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
                    if (response.status.code === "200") {
                        let found = response.data.found;
        
                        if (searchText.trim()) {
                            if (activeTabId === "employee-tab") {
                                populateEmployeeData(found);
                            } else if (activeTabId === "department-tab") {
                                populateDepartmentData(found);
                            } else if (activeTabId === "location-tab") {
                                populateLocationData(found);
                            }
                            updateFooterOnHover();
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
            if (searchText.trim() === "") {
                fetchAllDataForTab(activeTabId);
                updateFooterOnHover();
            }
        });


    getAllEmployeeInfo();
    getAllDepartmentInfo();
    getAllLocationInfo();
    updateFooterOnHover();

    // Update the footer based on the initially visible table
    setTimeout(() => {
        let totalRows = $("#employeesTable tbody tr").length;
        $(".footer").text(`Record: 1 of ${totalRows}`);
    }, 500);

});
