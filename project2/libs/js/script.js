let searchableData = {
    staff: [],
    departments: [],
    locations: []
};
function showAlertModal(type, message) {
    var emoji;
    switch (type) {
        case 'success':
            emoji = '✅';
            break;
        case 'restrict':
            emoji = '🛑'; 
            break;
        case 'warning':
            emoji = '⚠️'; 
            break;
        default:
            emoji = ''; // no emoji or a default emoji
    }

    var alertEmoji = document.getElementById('alertEmoji'); // Assuming this is a <span> or <div>
    var alertText = document.getElementById('alertModalText');

    // Set the emoji
    if (emoji) {
        alertEmoji.textContent = emoji;
        alertEmoji.style.display = 'inline'; // or 'block', depending on your layout
    } else {
        alertEmoji.style.display = 'none';
    }

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

                // Populate options for both select elements
                populateSelectOptions('#add-departments', departments);
                populateSelectOptions('#allDepartments', departments);
            }
        },
        error: () => {
            console.error('Error loading departments');
        }
    });
};

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
        }
    });
};

populateLocationSelectElements();



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
            content += `<tr data-index="${i + 1}">`;
            content += `<td class="listItem" title="${employee.firstName} ${employee.lastName}" data-bs-toggle data-bs-target="#readOnlyForm" data-id="${employee.id}">${employee.firstName} ${employee.lastName}</td>`;
            content += `<td class="d-none d-sm-table-cell">${employee.department}</td>`;
            content += `<td class="d-none d-sm-table-cell" >${employee.location}</td>`;
            content += `<td class="w-12" style="text-align:center"><a href="#" class="editButtonPersonnel" data-id="${employee.id}">
            ✏️</a>`;
            content += `<td class="w-12" style="text-align:center"><a href="#" class="deleteButtonPersonnel" data-id="${employee.id}">🗑️</td>`;
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
            content += `<tr data-index="${i + 1}">`;
            content += `<td class="listItem">${departmentName}</td>`;
            content += `<td class="d-none d-sm-table-cell">${department.location}</td>`;
            content += `<td class="w-12" style="text-align:center"><a href="#" class="editButtonDepartment" data-id="${department.id}">✏️</a></td>`;
            content += `<td class="w-12" style="text-align:center"><a href="#" class="deleteButtonDepartment" data-id="${department.id}">🗑️</a></td>`;
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
            content += `<tr data-index="${i + 1}">`;
            content += `<td class="listItem">${location.name}</td>`;
            content += `<td  style="text-align:center"><a href="#" class="editLocation" data-id="${location.id}">✏️</td>`;
            content += `<td style="text-align:center"><a href="#" class="deleteLocation" data-id="${location.id}">🗑️</td>`;
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

    $(document).on('click', '.editButtonPersonnel', function(event) {
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
            departmentID: $('#allDepartments').val()
        };
        // console.log('Sending data:', updatedData);
        updatePersonnel(updatedData);
    });

    $(document).on('click', '.editButtonDepartment', function(event) {
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
        $('#delete-personnel-id').val(personnelId);
        $('#deletePersonnel').modal('show');
    });

    // Open the delete department modal
    $(document).on('click', '.deleteButtonDepartment', function(event) {
        event.preventDefault();
        const departmentId = $(this).data('id');
        $('#delete-department-id').val(departmentId);
        $('#deleteDepartment').modal('show');
    });

    // Open the delete location modal
    $(document).on('click', '.deleteLocation', function(event) {
        event.preventDefault();
        const locationId = $(this).data('id');
        $('#delete-location-id').val(locationId);
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
                    searchAll('')
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
        $(".data-table").hide();
        $('#searchBarSearch').val('');
        fetchAllDataForTab(activeTabId);
        currentSearchText = '';
        switch (activeTabId) {
            case "employee-tab":
                $("#employeesTable").show();
                break;
            case "department-tab":
                $("#departmentTable").show();
                break;
            case "location-tab":
                $("#locationTable").show();
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

    // Handle input event for search
    $('#searchBarSearch').on('input', function() {
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

    // Update the footer based on the initially visible table
    setTimeout(() => {
        let totalRows = $("#employeesTable tbody tr").length;
        $(".footer").text(`Record: 1 of ${totalRows}`);
    }, 500);

});