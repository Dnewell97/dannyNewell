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

populateDepartmentSelectElements();


const populateSelectOptions = (selectElementId, departments) => {
    let selectElement = document.querySelector(selectElementId);
    selectElement.innerHTML = ''; // Clear existing options

    departments.forEach(department => {
        let option = document.createElement('option');
        option.value = department.id;
        option.textContent = department.name;
        selectElement.appendChild(option);
    });
};

populateDepartmentSelectElements()

const populateLocationSelectElements = () => {
    $.ajax({
        type: "POST",
        url: "libs/php/getAllLocation.php",
        dataType: "json",
        success: (response) => {
            if (response.status.code === "200") {
                let locations = response.data;

                let selectElementsToUpdate = [
                    document.getElementById('add-department-location'),
                    document.getElementById('edit-department-location'),
                    document.getElementById('locationFilter') 
                ];

                selectElementsToUpdate.forEach(selectElement => {
                    if (selectElement && locations.length > 0) {
                        selectElement.innerHTML = ''; // Clear existing options

                        locations.forEach(location => {
                            let option = document.createElement('option');
                            option.value = location.id;
                            option.text = location.name;
                            selectElement.appendChild(option);
                        });
                    }
                });
            }
        },
        error: () => {
            console.error('Error loading locations');
        }
    });
};

populateLocationSelectElements();

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

$('#filterButton').on('click', function() {
    $('#filterModal').modal('show');
});


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
                // table populated after the data is fetched
                populateEmployeeData(searchableData["staff"]);
                if (typeof updateInitialFooter === "function") {
                    updateInitialFooter();
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
            },
            complete: () => {
                populateDepartmentData(searchableData["department"]);
                if (typeof updateInitialFooter === "function") {
                    updateInitialFooter();
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
                        // console.log('Could not load locations');
                    }
                }
            },
            error: (xhr, status, error) => {
                console.error("Error fetching data:", error);
            },
            complete: () => {
                populateLocationData(searchableData["location"]);
                if (typeof updateInitialFooter === "function") {
                    updateInitialFooter();
                }
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
        // console.log("Employee table updated. Current rows:", tableBody.children().length);
        updateFooterOnHover();
        bindHoverEvents("#employeesList")
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
            content += `<button type="button" class="btn btn-primary btn-sm me-2 editButtonDepartment" data-id="${department.id}"><i class="fa-solid fa-pencil fa-fw"></i></button>`;
            content += `<button type="button" class="btn btn-primary btn-sm deleteButtonDepartment" data-id="${department.id}"><i class="fa-solid fa-trash fa-fw"></i></button>`;
            content += `</td>`;
            content += `</tr>`;
        }

        tableBody.html(content);
        updateFooterOnHover();
        bindHoverEvents('#departmentList');
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
            content += `<button type="button" class="btn btn-primary btn-sm me-2 editLocation" data-id="${location.id}"><i class="fa-solid fa-pencil fa-fw"></i></button>`;
            content += `<button type="button" class="btn btn-primary btn-sm deleteLocation" data-id="${location.id}"><i class="fa-solid fa-trash fa-fw"></i></button>`;
            content += `</td>`;
            content += `</tr>`;
        }
        tableBody.html(content);
        // console.log("Location table updated. Current rows:", tableBody.children().length); 
        updateFooterOnHover();
        bindHoverEvents('#locationList')
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
    $('#addEmployeeButton').click(function() {
        $('#addPersonnel').modal('show');
    });

    // When the Add Department button is clicked
    $('#addDepartmentButton').click(function() {
        $('#addDepartment').modal('show');
    });

    // When the Add Location button is clicked
    $('#addLocationButton').click(function() {
        $('#addLocation').modal('show');
    });

    $('#addDepartment').on('show.bs.modal', function() {
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

    $(document).on('click show.bs.modal', '.editButtonPersonnel', function(event) {
        event.preventDefault();
        const personnelId = $(this).data('id');

        $.ajax({
            type: "POST",
            url: "libs/php/getPersonnelByID.php",
            data: {
                id: Number(personnelId)
            },
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
                    $('#add-departments').val(personnelData.departmentID);
                    $('#editPersonnel').modal('show');
                } else {
                    showAlertModal('restrict', 'Failed to fetch personnel data. Please try again.');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error during personnel data fetching:', textStatus, errorThrown);
            }
        });
    });

    // Update personnel function
    function updatePersonnel(updatedData) {
        $.ajax({
            type: "POST",
            url: "libs/php/updatePersonnel.php",
            data: updatedData,
            dataType: "json",
            success: function(response) {
                if (response.status.code === "200") {
                    showAlertModal('success', 'Personnel updated successfully!');
                    getAllEmployeeInfo();
                    searchAll('');
                    $('#searchBarSearch').val('');
                    $('#editPersonnel').modal('hide');
                } else {
                    showAlertModal('restrict', 'Failed to update personnel. Please try again.');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX Error', {
                    textStatus: textStatus,
                    errorThrown: errorThrown,
                    jqXHR: jqXHR
                });
            }
        });
    }

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
        // console.log('Sending data:', updatedData);
        updatePersonnel(updatedData);
    });

    $(document).on('click show.bs.modal', '.editButtonDepartment', function(event) {
        event.preventDefault();
        const departmentId = $(this).data('id');
        // console.log("Department ID:", departmentId);
        $.ajax({
            type: "POST",
            url: "libs/php/getDepartmentByID.php",
            data: {
                id: departmentId
            },
            dataType: "json",
            success: function(response) {
                if (response.status.code === "200") {
                    const departmentData = response.data[0];
                    $('#edit-department-id').val(departmentData.id);
                    $('#edit-department-name').val(departmentData.name);
                    $('#edit-department-location').val(departmentData.locationID);
                    $('#editDepartment').modal('show');
                } else {
                    showAlertModal('restrict', 'Failed to fetch department data. Please try again.');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error during department data fetching:', textStatus, errorThrown);
            }
        });
    });

    function updateDepartment(departmentData) {
        $.ajax({
            type: "POST",
            url: "libs/php/updateDepartment.php",
            data: departmentData,
            dataType: "json",
            success: function(response) {
                // console.log(response);
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
        $('#searchBarSearch').val('');
        $('#editDepartment').modal('hide');
    });

    $(document).on('click', '.editLocation', function(event) {
        event.preventDefault();
        const locationId = $(this).data('id');

        $.ajax({
            type: "POST",
            url: "libs/php/getLocationByID.php",
            data: {
                id: locationId
            },
            dataType: "json",
            success: function(response) {
                if (response.status.code === "200" && response.data.length > 0) {
                    const locationData = response.data[0];
                    $('#edit-location-id').val(locationData.id);
                    $('#edit-location-name').val(locationData.name);
                    $('#editLocation').modal('show');
                } else {
                    showAlertModal('restrict', 'Failed to fetch location data. Please try again.');
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
                    showAlertModal('success', 'Location updated successfully!');
                    getAllLocationInfo();
                } else {
                    showAlertModal('restrict', 'Failed to update location. Please try again.');
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
        $('#searchBarSearch').val('');
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
        event.preventDefault();
        const departmentId = $(this).data('id');
        const departmentName = $(this).closest('tr').find('td:first-child').text().trim();
        $('#delete-department-id').val(departmentId);
        $('#deleteDepartment .modal-body p').text(`Are you sure you want to delete the ${departmentName} department?`);
        $('#deleteDepartment').modal('show');
        console.log("Department ID:", departmentId, "Name:", departmentName);
    });

    // Open the delete location modal
    $(document).on('click', '.deleteLocation', function(event) {
        event.preventDefault();
        const locationId = $(this).data('id');
        const locationName = $(this).closest('tr').find('td:first').text().trim();
        $('#delete-location-id').val(locationId);
        $('#deleteLocation .modal-body p').text(`Are you sure you want to delete the ${locationName} location?`);
        $('#deleteLocation').modal('show');
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
            data: {
                id: id
            },
            dataType: "json",
            success: function(response) {
                if (response.status.code === "200") {
                    showAlertModal('success', 'Department deleted successfully!');
                    getAllDepartmentInfo();
                    searchAll('');
                  	populateDepartmentSelectElements();
                } else if (response.status.code === "409") {
                    showAlertModal('restrict', 'Cannot delete department as it has assigned personnel.');
                } else {
                    showAlertModal('restrict', 'Failed to delete department.');
                }
            },
            error: function() {
                showAlertModal('restrict', 'Error occurred while deleting department.');
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

    // Function to handle tab click
    $(".nav-link").click(function() {
        activeTabId = $(this).attr("id");
        searchAll('');
        $(".table").hide();
        $('#searchBarSearch').val('');
        fetchAllDataForTab(activeTabId);
        currentSearchText = '';
    
        // Hide the filter button by default
        $("#filterButton").closest('.btn-group').hide();
    
        switch (activeTabId) {
            case "employee-tab":
                $("#employeesTable").show();
                // Show the filter button only for the employee tab
                $("#filterButton").closest('.btn-group').show();
                break;
            case "department-tab":
                $("#departmentTable").show();
                break;
            case "location-tab":
                $("#locationTable").show();
                break;
        }
    });
    
    document.getElementById('refreshBtn').addEventListener('click', function() {
        getAllEmployeeInfo();
        getAllDepartmentInfo();
        getAllLocationInfo();
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
                        updateFooterOnHover();
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
            updateFooterOnHover();
        }
    });
    let lastChangedFilter = ''; // This will store the last changed filter

$('#departmentFilter').change(function() {
    lastChangedFilter = 'department';
});

$('#locationFilter').change(function() {
    lastChangedFilter = 'location';
});

function applyFilter(event) {
    event.preventDefault();

    let departmentId = $('#departmentFilter').val();
    let locationId = $('#locationFilter').val();

    $.ajax({
        url: 'libs/php/filterAll.php',
        type: 'GET', 
        dataType: 'json',
        data: {
            department: departmentId,
            location: locationId,
            lastChanged: lastChangedFilter // Send the last changed filter information
        },

            success: function(response) {
                if (response.status.code === "200") {
                    let filter = response.data.found
                    populateEmployeeData(filter); 
                } else {
                    console.log('Query failed:', response.status.description);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error: ' + error);
            }
        });
    }
    
    $('#applyFilterBtn').on('click', function(event) {
        applyFilter(event);
    });
    
    



    getAllEmployeeInfo();
    getAllDepartmentInfo();
    getAllLocationInfo();

    // Update the footer based on the initially visible table
    setTimeout(() => {
        let totalRows = $("#employeesTable tbody tr").length;
        $(".footer").text(`Record: 1 of ${totalRows}`);
    }, 500);

});