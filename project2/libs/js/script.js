let searchableData = {
    staff: [],
    departments: [],
    locations: []
};
function showAlertModal(type, message) {
    
    var alertText = document.getElementById('alertModalText');

    // Set the message text
    alertText.textContent = message;

    // Show the modal
    var alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
    alertModal.show();
}


const populateDepartmentSelectElements = () => {
    $.ajax({
        type: "POST",
        url: "libs/php/getAllDepartments.php",
        dataType: "json",
        success: (response) => {
            if (response.status.code === "200") {
                let departments = response.data;

                // Populate options for all department select elements
                populateSelectOptions('#add-departments', departments);
                populateSelectOptions('#allDepartments', departments);
                populateSelectOptions('#departmentFilter', departments); 
            }
        },
        error: () => {
            console.error('Error loading departments');
        }
    });
};

const populateLocationSelectElements = () => {
    $.ajax({
        type: "POST",
        url: "libs/php/getAllLocation.php",
        dataType: "json",
        success: (response) => {
            if (response.status.code === "200") {
                let locations = response.data;

                // Populate options for all location select elements
                populateSelectOptions('#add-department-location', locations);
                populateSelectOptions('#edit-department-location', locations);
                populateSelectOptions('#locationFilter', locations);
            }
        },
        error: () => {
            console.error('Error loading locations');
        }
    });
};

const populateSelectOptions = (selectElementId, items, includeAllOption = false) => {
    let selectElement = $(selectElementId);
    if (!selectElement.length) {
        console.error(`Element not found: ${selectElementId}`);
        return;
    }

    selectElement.empty(); // Clear existing options

    if (includeAllOption) {
        selectElement.append($('<option>', { value: 'all', text: 'All' }));
    }

    items.forEach(item => {
        selectElement.append($('<option>', { value: item.id, text: item.name }));
    });
};

$('#addButton').on('click', function() {
    var activeTab = $('.nav-link.active').attr('id');
    
    switch (activeTab) {
        case 'employee-tab':
            $('#addPersonnel').modal('show');
            break;
        case 'department-tab':
            $('#addDepartment').modal('show');
            break;
        case 'location-tab':
            $('#addLocation').modal('show');
            break;
        default:
            console.log('No active tab detected.');
    }
});

$(document).ready(() => {
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
            },
            complete: () => {
                // table populated after the data is fetched
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
            },
            complete: () => {
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
                        // console.log('Could not load locations');
                    }
                }
            },
            error: (xhr, status, error) => {
                console.error("Error fetching data:", error);
            },
            complete: () => {
                populateLocationData(searchableData["location"]);
            }
        });
    };

    const populateEmployeeData = (data) => {
        let content = "";
        // console.log("Populating employee data:", data); 
        let tableBody = $("#employeesList");
        tableBody.empty();

        for (let i = 0; i < data.length; i++) {
            const employee = data[i];
            content += `<tr>`;
            content += `<td class="align-middle text-nowrap">${employee.lastName}, ${employee.firstName}</td>`;
            content += `<td class="align-middle text-nowrap d-none d-md-table-cell">${employee.department}</td>`;
            content += `<td class="align-middle text-nowrap d-none d-md-table-cell">${employee.location}</td>`;
            content += `<td class="align-middle text-nowrap d-none d-md-table-cell">${employee.email}</td>`;
            content += `<td class="text-end text-nowrap">`;
            content += `<button type="button" class="btn btn-primary btn-sm me-2 editButtonPersonnel" data-bs-toggle="modal" data-bs-target="#editPersonnel" data-id="${employee.id}"><i class="fa-solid fa-pencil fa-fw"></i></button>`;
            content += `<button type="button" class="btn btn-primary btn-sm deleteButtonPersonnel" data-id="${employee.id}"><i class="fa-solid fa-trash fa-fw"></i></button>`;
            content += `</td>`;
            content += `</tr>`;
        }
        tableBody.html(content);
    };

    const populateDepartmentData = (data) => {
        let tableBody = $("#departmentList");
        tableBody.empty(); // Clear existing rows

        let content = "";
        for (let i = 0; i < data.length; i++) {
            const department = data[i];
            // console.log("Department Data:", department); 

            let departmentName = department.department || department.name;
            content += `<tr>`;
            content += `<td class="align-middle text-nowrap">${departmentName}</td>`;
            content += `<td class="align-middle text-nowrap d-none d-md-table-cell">${department.location}</td>`;
            content += `<td class="text-end text-nowrap">`;
            content += `<button type="button" class="btn btn-primary btn-sm me-2 editButtonDepartment" data-bs-toggle="modal" data-bs-target="#editDepartment" data-id="${department.id}"><i class="fa-solid fa-pencil fa-fw"></i></button>`;
            content += `<button type="button" class="btn btn-primary btn-sm deleteButtonDepartment" data-id="${department.id}"><i class="fa-solid fa-trash fa-fw"></i></button>`;
            content += `</td>`;
            content += `</tr>`;
        }

        tableBody.html(content);
    };

    const populateLocationData = (data) => {
        let content = "";
        // console.log("Populating location data:", data);
        let tableBody = $("#locationList");
        tableBody.empty();

        for (let i = 0; i < data.length; i++) {
            const location = data[i];
            content += `<tr>`;
            content += `<td class="align-middle text-nowrap">${location.name}</td>`;
            content += `<td class="text-end text-nowrap">`;
            content += `<button type="button" class="btn btn-primary btn-sm me-2 editLocation" data-bs-toggle="modal" data-bs-target="#editLocation" data-id="${location.id}"><i class="fa-solid fa-pencil fa-fw"></i></button>`;
            content += `<button type="button" class="btn btn-primary btn-sm deleteLocation" data-id="${location.id}"><i class="fa-solid fa-trash fa-fw"></i></button>`;
            content += `</td>`;
            content += `</tr>`;
        }
        tableBody.html(content);
    };

    function addDepartment() {
        // Get form data
        const departmentName = $('#add-department-name').val();
        const locationID = $('#add-department-location').val();

        $.ajax({
            type: "POST",
            url: "libs/php/insertDepartment.php",
            data: {
                name: departmentName,
                locationID: locationID
            },
            dataType: "json",
            success: function(response) {
                if (response.status.code === "200") {
                    showAlertModal('success', 'Department added successfully!');
                } else if (response.status.code === "400") {
                    showAlertModal('restrict', 'Failed to add department. Please try again.');
                } else if (response.status.code === "1062") {
                    showAlertModal('restrict', 'This department already exists.');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error during department addition:', textStatus, errorThrown);
            }
        });
    }

    $('#addDepartment').on('show.bs.modal', function() {
        populateLocationSelectElements();
        // Reset the form fields to empty
        $('#add-department-name').val('');
    });
    // event listener for the form submission
    $('#createDepForm').submit(function(event) {
        event.preventDefault();
        addDepartment();
        $('#addDepartment').modal('hide');

    });

    $('#addDepartment').on('hidden.bs.modal', function() {
        // Update department list 
        getAllDepartmentInfo();
        populateDepartmentSelectElements();
    });

    function addLocation() {
        const locationName = $('#add-location-name').val();

        $.ajax({
            type: "POST",
            url: "libs/php/insertLocation.php",
            data: {
                name: locationName
            },
            dataType: "json",
            success: function(response) {
                if (response.status.code === "200") {
                    showAlertModal('success', 'Location added successfully!');
                    getAllLocationInfo();
                    populateLocationSelectElements();
                } else if (response.status.code === "400") {
                    showAlertModal('restrict', 'Failed to add location. Please try again.');
                } else if (response.status.code === "1062") {
                    showAlertModal('restrict', 'This location already exists');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error during location addition:', textStatus, errorThrown);
            }
        });
    }

    $('#addLocation').on('show.bs.modal', function() {
        $('#add-location-name').val('');
    });

    $('#createLocForm').submit(function(event) {
        event.preventDefault();
        addLocation();
        getAllLocationInfo();
        populateLocationSelectElements();
        $('#addLocation').modal('hide');
    });

    function addPersonnel() {
        const firstName = $('#add-firstName').val();
        const lastName = $('#add-lastName').val();
        const jobTitle = $('#add-jobTitle').val();
        const email = $('#add-email').val();
        const departmentID = $('#allDepartments').val();

        $.ajax({
            type: "POST",
            url: "libs/php/insertPersonnel.php",
            data: {
                firstName: firstName,
                lastName: lastName,
                jobTitle: jobTitle,
                email: email,
                departmentID: departmentID
            },
            dataType: "json",
            success: function(response) {
                // console.log('Response:', response);
                if (response.status.code === "200") {
                    showAlertModal('success', 'Personnel added successfully!');
                } else if (response.status.code === "400") {
                    showAlertModal('restrict', 'Failed to add personnel. Please try again.');
                } else if (response.status.code === "1062") {
                    showAlertModal('restrict', 'Duplicate entry: Personnel with the same details already exists.');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error during personnel addition:', textStatus, errorThrown);
            }
        });
    }
    $('#addPersonnel').on('show.bs.modal', function() {
        populateDepartmentSelectElements()
        $('#add-firstName').val('');
        $('#add-lastName').val('');
        $('#add-jobTitle').val('');
        $('#add-email').val('');
        $('#alldepartments').prop('selectedIndex', 0);
    });
    $('#addEmployeeForm').submit(function(event) {
        event.preventDefault();
        addPersonnel();
        $('#addPersonnel').modal('hide');
    });
    // Global variable to store the current personnel ID
// Event listener for showing the Edit Personnel modal
$('#editPersonnel').on('show.bs.modal', function(e) {
    const personnelId = $(e.relatedTarget).data('id');
    $('#edit-personnel-id').val(personnelId); // Set the personnel ID

    // Fetch and populate personnel data
    $.ajax({
        type: "POST",
        url: "libs/php/getPersonnelByID.php",
        data: { id: Number(personnelId) },
        dataType: "json",
        success: (response) => {
            if (response.status.code === "200") {
                populateEditPersonnelModal(response.data.personnel[0]);
            } else {
                showAlertModal('restrict', 'Failed to fetch personnel data. Please try again.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error during personnel data fetching:', textStatus, errorThrown);
        }
    });

    // Populate department select
    populateDepartmentSelectElements();
});

// Function to Populate Edit Personnel Modal
function populateEditPersonnelModal(personnelData) {
    $('#edit-lastName').val(personnelData.lastName);
    $('#edit-firstName').val(personnelData.firstName);
    $('#edit-email').val(personnelData.email);
    $('#edit-jobTitle').val(personnelData.jobTitle);
    $('#add-departments').val(personnelData.departmentID); 
}

// Form Submission for Edit Personnel
$('#editPersonnelForm').submit(function(event) {
    event.preventDefault();

    const updatedData = {
        id: $('#edit-personnel-id').val(),
        lastName: $('#edit-lastName').val(),
        firstName: $('#edit-firstName').val(),
        email: $('#edit-email').val(),
        jobTitle: $('#edit-jobTitle').val(),
        departmentID: $('#add-departments').val()
    };

    // AJAX call to update personnel
    updatePersonnel(updatedData);
});

// Function to update personnel
function updatePersonnel(updatedData) {
    $.ajax({
        type: "POST",
        url: "libs/php/updatePersonnel.php",
        data: updatedData,
        dataType: "json",
        success: function(response) {
            if (response.status.code === "200") {
                $('#editPersonnel').modal('hide');
                showAlertModal('success', 'Personnel updated successfully!');
                getAllEmployeeInfo(); // Refresh the employee list
                $('#searchBarSearch').val('');
            } else {
                showAlertModal('restrict', 'Failed to update personnel. Please try again.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error during personnel update:', textStatus, errorThrown);
        }
    });
}
$('#editDepartment').on('show.bs.modal', function(event) {
    let departmentId = $(event.relatedTarget).data('id');

    // Fetch and populate location select options
    populateLocationSelectElements();

    // Fetch and populate department data
    $.ajax({
        type: "POST",
        url: "libs/php/getDepartmentByID.php",
        data: { id: departmentId },
        dataType: "json",
        success: function(response) {
            if (response.status.code === "200") {
                const departmentData = response.data[0];
                $('#edit-department-id').val(departmentData.id);
                $('#edit-department-name').val(departmentData.name);
                $('#edit-department-location').val(departmentData.locationID);
            } else {
                showAlertModal('restrict', 'Failed to fetch department data. Please try again.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error during department data fetching:', textStatus, errorThrown);
        }
    });
});

// Function to update department
function updateDepartment(departmentData) {
    $.ajax({
        type: "POST",
        url: "libs/php/updateDepartment.php",
        data: departmentData,
        dataType: "json",
        success: function(response) {
            if (response.status.code === "200") {
                showAlertModal('success', 'Department updated successfully!');
                getAllDepartmentInfo();
                $('#searchBarSearch').val('');
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

// Event listener for department form submission
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

// Event listener for the location edit modal
$('#editLocation').on('show.bs.modal', function(event) {
    let locationId = $(event.relatedTarget).data('id');
    
    // Fetch and populate location data
    $.ajax({
        type: "POST",
        url: "libs/php/getLocationByID.php",
        data: { id: locationId },
        dataType: "json",
        success: function(response) {
            if (response.status.code === "200" && response.data.length > 0) {
                const locationData = response.data[0];
                $('#edit-location-id').val(locationData.id);
                $('#edit-location-name').val(locationData.name);
            } else {
                showAlertModal('restrict', 'Failed to fetch location data. Please try again.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error during location data fetching:', textStatus, errorThrown);
        }
    });
});

// Update location function
function updateLocation(locationData) {
    $.ajax({
        type: "POST",
        url: "libs/php/updateLocation.php",
        data: locationData,
        dataType: "json",
        success: function(response) {
            if (response.status.code === "200") {
                showAlertModal('success', 'Location updated successfully!');
                getAllLocationInfo();
                $('#searchBarSearch').val('');
            } else {
                showAlertModal('restrict', 'Failed to update location. Please try again.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error during location update:', textStatus, errorThrown);
        }
    });
}

// Form submission event for updating location
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
        let fullName = $(this).closest('tr').find('td:first').text().trim(); 
        fullName = fullName.replace(/,/g, '');
        const names = fullName.split(' ');
        const formattedName = names.length > 1 ? `${names[1]} ${names[0]}` : fullName;

        $('#delete-personnel-id').val(personnelId);
        $('#deletePersonnel .modal-body p').text(`Are you sure you want to delete ${formattedName}?`);
        $('#deletePersonnel').modal('show');

    });

    // Open the delete department modal
    $(document).on('click', '.deleteButtonDepartment', function(event) {
        // console.log("Delete department button clicked");
        event.preventDefault();
        const departmentId = $(this).data('id');

        $.ajax({
            type: "POST",
            url: "libs/php/checkDepartmentLinked.php", 
            data: { id: departmentId },
            dataType: "json",
            success: function(response) {
                // console.log(response);
                if (response.status.code === "200") {
                    // Show confirmation modal for deletion
                    $('#deleteDepartment .modal-body p').text(`Are you sure you want to delete the ${response.data.departmentName} department?`);
                    $('#delete-department-id').val(departmentId);
                    $('#deleteDepartment').modal('show');
                } else if (response.status.code === "409") {
                    // Show modal indicating that the department cannot be deleted
                    $('#cantDeleteDepartmentModal #cantDeleteDeptName').text(response.data.departmentName);
                    $('#cantDeleteDepartmentModal #personnelCount').text(response.data.personnelCount);
                    $('#cantDeleteDepartmentModal').modal('show');
                } else {
                    showAlertModal('Error', 'Failed to fetch department data. Please try again.');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showAlertModal('Error', 'Error occurred while fetching department data.');
            }
            
        });
    });

    // Open the delete location modal
    $(document).on('click', '.deleteLocation', function(event) {
        event.preventDefault();
        const locationId = $(this).data('id');
        const locationName = $(this).closest('tr').find('td:first').text().trim();
    
        $.ajax({
            type: "POST",
            url: "libs/php/checkLocationLinked.php",
            data: { id: locationId },
            dataType: "json",
            success: function(response) {
                if (response.status.code === "200") {
                    // No dependencies, show deletion confirmation modal
                    $('#deleteLocation .modal-body p').text(`Are you sure you want to delete the ${locationName} location?`);
                    $('#delete-location-id').val(locationId);
                    $('#deleteLocation').modal('show');
                } else if (response.status.code === "409") {
                    // Dependencies exist, show error modal
                    $('#cantDeleteLocationModal #cantDeleteLocName').text(locationName); 
                    $('#cantDeleteLocationModal').modal('show'); 
                }
            },
            error: function() {
                showAlertModal('error', 'Error occurred while checking location dependencies.');
            }
        });
    });
    

    // Handle form submission for deleting personnel
    $('#deletePersonnelForm').submit(function(event) {
        event.preventDefault();
        const id = $('#delete-personnel-id').val();
        deletePersonnel(id);
        getAllEmployeeInfo();
        searchAll('');
        $('#searchBarSearch').val('');
        $('#deletePersonnel').modal('hide');
    });

    // Handle form submission for deleting department
    $('#deleteDepartmentForm').submit(function(event) {
        event.preventDefault();
        const id = $('#delete-department-id').val();
        deleteDepartment(id);
        getAllDepartmentInfo();
        searchAll('');
        $('#searchBarSearch').val('');
        $('#deleteDepartment').modal('hide');
    });

    // Handle form submission for deleting location
    $('#deleteLocationForm').submit(function(event) {
        event.preventDefault();
        const id = $('#delete-location-id').val();
        deleteLocation(id);
        searchAll('');
        $('#searchBarSearch').val('');
        getAllLocationInfo();
        $('#deleteLocation').modal('hide');
    });

    function deletePersonnel(id) {
        $.ajax({
            type: "POST",
            url: "libs/php/deletePersonnelByID.php",
            data: {
                id: id
            },
            dataType: "json",
            success: function(response) {
                if (response.status.code === "200") {
                    showAlertModal('success', 'Personnel deleted successfully!');
                    getAllEmployeeInfo();
                    searchAll('');
                } else {
                    showAlertModal('restrict', 'Failed to delete personnel.');
                }
            },
            error: function() {
                showAlertModal('restrict', 'Error occurred while deleting personnel.');
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
                    showAlertModal('success', 'Department deleted successfully!');
                    getAllDepartmentInfo();
                    searchAll('');
                    populateDepartmentSelectElements();
                } else {
                    // Handle other server-side errors that might occur during deletion
                    showAlertModal('error', 'Failed to delete department: ' + response.status.description);
                }
            },
            error: function() {
                // Handle AJAX request errors (network issues, server downtime, etc.)
                showAlertModal('error', 'Network or server error occurred while deleting the department.');
            }
        });
    }
    

    function deleteLocation(id) {
        $.ajax({
            type: "POST",
            url: "libs/php/deleteLocationByID.php",
            data: {
                id: id
            },
            dataType: "json",
            success: function(response) {
                if (response.status.code === "200") {
                    showAlertModal('success', 'Location deleted successfully!');
                    getAllLocationInfo();
                    searchAll('');
                    populateLocationSelectElements();
                } else if (response.status.code === "409") {
                    showAlertModal('restrict', 'Cannot delete location as it has associated departments.');
                } else {
                    showAlertModal('restrict', 'Failed to delete location.');
                }
            },
            error: function() {
                showAlertModal('restrict', 'Error occurred while deleting location.');
            }
        });
    }

    $("#departmentTable").hide();
    $("#locationTable").hide();

    // Declare activeTabId globally and set initial active tab
    let activeTabId = "employee-tab";

    $(".nav-link").click(function() {
        activeTabId = $(this).attr("id");
        searchAll('');
        $(".table").hide();
        $('#searchBarSearch').val('');
        resetFilters();
        fetchAllDataForTab(activeTabId);
        currentSearchText = '';
    
        switch (activeTabId) {
            case "employee-tab":
                $("#employeesTable").show();
                $("#filterButton").attr("disabled", false);
                break;
            case "department-tab":
                $("#departmentTable").show();
                $("#filterButton").attr("disabled", true);
                break;
            case "location-tab":
                $("#locationTable").show();
                $("#filterButton").attr("disabled", true);
                break;
        }
    });
    const resetFilters = () => {
        departmentId = 'all';
        locationId = 'all';
        lastChanged = '';
        populateFilters(); // Populate filters after resetting them
    };

    document.getElementById('refreshBtn').addEventListener('click', function() {
        resetFilters();
        // Get the active tab ID
        var activeTabId = $('.nav-link.active').attr('id');
    
        // Clear search bar
        $('#searchBarSearch').val('');
    
        // Refresh data based on active tab
        switch (activeTabId) {
            case 'employee-tab':
                getAllEmployeeInfo();
                break;
            case 'department-tab':
                getAllDepartmentInfo();
                break;
            case 'location-tab':
                getAllLocationInfo();
                break;
        }
    });
    
    const updateInitialFooter = () => {
        let activeTab = $('.nav-link.active').attr('id');
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
                // console.log('no active tab');
                return; // Exit the function if no known tab is active
        }
        let total = $(`${tableId} tr`).length;
        $(".footer").text(`Record: 1 of ${total}`);
    };

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
            data: {
                txt: searchText,
                activeTab: activeTabId
            },
            dataType: "json",
            success: function(response) {
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
                    }
                } else {
                    // console.log('Query failed:', response.status.description);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // console.error('Error during search:', textStatus, errorThrown);
            }
        });
    }

    $('#searchBarSearch').on('input', function() {
        let searchText = $(this).val();
        searchAll(searchText);
        if (searchText.trim() === "") {
            fetchAllDataForTab(activeTabId);
        }
    });

    let departmentId = 'all';
    let locationId = 'all';
    let lastChanged = ''; // Variable to store the last changed filter
    
    // Function to reset a select element to 'all'
    const resetSelectElement = (selectElementId) => {
        $(selectElementId).val('all');
    };
    
    // Function to apply filters based on the current selections
    function applyFilter() {
        $.ajax({
            url: 'libs/php/filterAll.php',
            type: 'GET',
            dataType: 'json',
            data: {
                department: departmentId,
                location: locationId,
                lastChanged: lastChanged
            },
            success: function(response) {
                if (response.status.code === "200") {
                    populateEmployeeData(response.data.found);
                } else {
                    console.error('Query failed:', response.status.description);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error: ' + error);
            }
        });
    }
    
    // Event listener for department filter change
    $('#departmentFilter').change(function() {
        departmentId = $(this).val();
        lastChanged = 'department';
        resetSelectElement('#locationFilter');
        locationId = 'all';
        applyFilter();
    });
    
    // Event listener for location filter change
    $('#locationFilter').change(function() {
        locationId = $(this).val();
        lastChanged = 'location';
        resetSelectElement('#departmentFilter');
        departmentId = 'all';
        applyFilter();
    });
    
 // Function to populate filters with the "All" option and selected values
const populateFilters = () => {
    // Fetch and populate departments
    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status.code === "200") {
                let departmentSelect = $('#departmentFilter');
                departmentSelect.empty();
                departmentSelect.append($('<option>', { value: 'all', text: 'All' }));
                response.data.forEach(department => {
                    departmentSelect.append($('<option>', { value: department.id, text: department.name }));
                });
                // Set the selected department after populating
                departmentSelect.val(departmentId);
            } else {
                console.error('Error loading departments:', response.status.description);
            }
        },
        error: function() {
            console.error('Error loading departments');
        }
    });

    // Fetch and populate locations
    $.ajax({
        url: 'libs/php/getAllLocation.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status.code === "200") {
                let locationSelect = $('#locationFilter');
                locationSelect.empty();
                locationSelect.append($('<option>', { value: 'all', text: 'All' }));
                response.data.forEach(location => {
                    locationSelect.append($('<option>', { value: location.id, text: location.name }));
                });
                // Set the selected location after populating
                locationSelect.val(locationId);
            } else {
                console.error('Error loading locations:', response.status.description);
            }
        },
        error: function() {
            console.error('Error loading locations');
        }
    });
};

// Event listener for showing the filter modal
$('#filterModal').on('show.bs.modal', function() {
    populateFilters();
});

// Populate filters on page load
populateFilters();


    getAllEmployeeInfo();
    getAllDepartmentInfo();
    getAllLocationInfo();

});
