function refresh_userUI() {
    $.get("/CMS/users", function (e) {
        $('#users-tbody').empty();
        $('#users-tbody').append(e);
        $("#users-table").trigger('update');
    });
}

function add_user_confirm() {
    if ($("#add-user-name").val().trim() != "" &&
        $("#add-user-email").val().trim() != "" && $("#add-user-money").val().trim() != "") {
        let users = {
            id: $("#add-user-name").val(),
            email: $("#add-user-email").val(),
            money: $("#add-user-money").val()
        };
        $.ajax({
            type: "post",
            url: "/CMS/users/add",
            data: users,
            success: function (res) {
                $("#add-user-tr").empty();
                refresh_userUI();
            }
        })
    } else {
        alert('欄位不可為空值');
    }

}

function add_user_cancel() {
    $("#add-user-tr").empty();
}

function edit_user(user_id, email, money, registertime) {
    $(`#usertr-${user_id}`).empty();
    $(`#usertr-${user_id}`).append(`<td>${user_id}</td>
            <td><input type="text" id="edit-${user_id}-email" value="${email}"></td>
            <td><input type="number" id="edit-${user_id}-money" value="${money}"></td>
            <td>${registertime}</td>
            <td><button onclick="edit_user_confirm('${user_id}')">確定</button>`+
            `<button  onclick="edit_user_cancel('${user_id}','${email}','${money}','${registertime}')">取消</button></td>`);
}
function edit_user_confirm(user_id) {
    if ($(`#edit-${user_id}-email`).val().trim() != "" && $(`#edit-${user_id}-money`).val().trim() != "") {
        let users = {
            id: user_id,
            email: $(`#edit-${user_id}-email`).val(),
            money: $(`#edit-${user_id}-money`).val()
        };
        $.ajax({
            type: "put",
            url: "/CMS/users/edit",
            data: users,
            success: function (res) {
                refresh_userUI();
            }
        })
    } else {
        alert('欄位不可為空值')
    }

}
function edit_user_cancel(user_id, email, money, registertime) {
    $(`#usertr-${user_id}`).empty();
    $(`#usertr-${user_id}`).append(`<td>${user_id}</td>
            <td>${email}</td>
            <td>${money}</td>
            <td>${registertime}</td>
            <td><button onclick="edit_user('${user_id}','${email}','${money}','${registertime}')" >修改</button>`+
            `<button onclick="del_user('${user_id}')">刪除</button> </td>`);
}

function del_user(user_id) {
    if (confirm('確認刪除：' + user_id)) {
        let users = {
            id: user_id
        }
        $.ajax({
            type: "delete",
            url: "/CMS/users/del",
            data: users,
            success: function (res) {
                refresh_userUI();
            }
        })
    } else {

    }

}