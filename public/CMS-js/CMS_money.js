function refresh_moneyUI() {
$.get("/CMS/money", function (e) {
    $('#money-tbody').empty();
    $('#money-tbody').append(e);
    $("#money-table" ).trigger('update');
});
}

function add_money_confirm() {
if ($("#add-money-user_id").val().trim() != "" && $("#add-money-money").val().trim() != "") {
    let money = {
        user_id: $("#add-money-user_id").val(),
        money: $("#add-money-money").val()
    };
    $.ajax({
        type: "post",
        url: "/CMS/money/add",
        data: money,
        success: function (res) {
            $("#add-money-tr").empty();
            refresh_moneyUI();
        }
    })
} else {
    alert('欄位不可為空值');
}

}

function add_money_cancel() {
$("#add-money-tr").empty();
}

function edit_money(money_id, user_id , money , date) {
$(`#moneytr-${money_id}`).empty();
$(`#moneytr-${money_id}`).append(`<td>${money_id}</td>
            <td><input type="text" id="edit-money-${money_id}-user_id" value="${user_id}"></td>
            <td><input type="number" id="edit-money-${money_id}-money" value="${money}"></td>
            <td>${date}</td>
            <td><button onclick="edit_money_confirm('${money_id}')">確定</button>`+
            `<button  onclick="edit_money_cancel('${money_id}','${user_id}','${money}','${date}')">取消</button></td>`);
}
function edit_money_confirm(money_id) {
if ($(`#edit-money-${money_id}-user_id`).val().trim() != "" && $(`#edit-money-${money_id}-money`).val().trim() != "" ) {
    let money = {
        id:money_id,
        user_id: $(`#edit-money-${money_id}-user_id`).val(),
        money: $(`#edit-money-${money_id}-money`).val()
    };
    $.ajax({
        type: "put",
        url: "/CMS/money/edit",
        data: money,
        success: function (res) {
            refresh_moneyUI();
        }
    })
} else {
    alert('欄位不可為空值')
}

}
function edit_money_cancel(money_id, user_id, money, date) {
$(`#moneytr-${money_id}`).empty();
$(`#moneytr-${money_id}`).append(`<td>${money_id}</td>
            <td>${user_id}</td>
            <td>${money}</td>
            <td>${date}</td>
            <td><button onclick="edit_money('${money_id}','${user_id}','${money}','${date}')" >修改</button>`+
            `<button onclick="del_money('${money_id}')">刪除</button> </td>`);
}

function del_money(money_id) {
if (confirm('確認刪除：'+money_id)) {
    let money= {
        id:money_id
    }
    $.ajax({
        type: "delete",
        url: "/CMS/money/del",
        data: money,
        success: function (res) {
            refresh_moneyUI();
        }
    })
} else {
    
}

}