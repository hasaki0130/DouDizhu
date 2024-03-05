function refresh_game_playwayUI() {
$.get("/CMS/game_playway", function (e) {
    $('#game_playway-tbody').empty();
    $('#game_playway-tbody').append(e);
    $("#game_playway-table" ).trigger('update');
});
}

function add_game_playway_confirm() {
if ($("#add-game_playway-banker-id").val().trim() != "" && $("#add-game_playway-banker-money").val().trim() != "" &&
    $("#add-game_playway-player1-id").val().trim() != "" && $("#add-game_playway-player1-money").val().trim() != ""&&
    $("#add-game_playway-player2-id").val().trim() != "" && $("#add-game_playway-player2-money").val().trim() != "") {
    let game_playway = {
        banker_id: $("#add-game_playway-banker-id").val(),
        banker_money: $("#add-game_playway-banker-money").val(),
        player1_id: $("#add-game_playway-player1-id").val(),
        player1_money: $("#add-game_playway-player1-money").val(),
        player2_id: $("#add-game_playway-player2-id").val(),
        player2_money: $("#add-game_playway-player2-money").val()
    };
    $.ajax({
        type: "post",
        url: "/CMS/game_playway/add",
        data: game_playway,
        success: function (res) {
            $("#add-game_playway-tr").empty();
            refresh_game_playwayUI();
        }
    })
} else {
    alert('欄位不可為空值')
}

}

function add_game_playway_cancel() {
$("#add-game_playway-tr").empty();
}

function edit_game_playway(game_id,banker_id,banker_money,player1_id,player1_money,player2_id,player2_money,date) {
$(`#game_playwaytr-${game_id}`).empty();
$(`#game_playwaytr-${game_id}`).append(`<td>${game_id}</td>
            <td><input type="text" id="edit-game_playway-${game_id}-banker_id" value="${banker_id}"></td>
            <td><input type="number" id="edit-game_playway-${game_id}-banker_money" value="${banker_money}"></td>
            <td><input type="text" id="edit-game_playway-${game_id}-player1_id" value="${player1_id}"></td>
            <td><input type="number" id="edit-game_playway-${game_id}-player1_money" value="${player1_money}"></td>
            <td><input type="text" id="edit-game_playway-${game_id}-player2_id" value="${player2_id}"></td>
            <td><input type="number" id="edit-game_playway-${game_id}-player2_money" value="${player2_money}"></td>
            <td>${date}</td>
            <td><button onclick="edit_game_playway_confirm('${game_id}')">確定</button>`+
            `<button  onclick="edit_game_playway_cancel('${game_id}','${banker_id}','${banker_money}','${player1_id}','${player1_money}','${player2_id}','${player2_money}','${date}')">取消</button></td>`);
}
function edit_game_playway_confirm(game_id) {
if ($(`#edit-game_playway-${game_id}-banker_id`).val().trim() != "" && $(`#edit-game_playway-${game_id}-banker_money`).val().trim() != "" &&
    $(`#edit-game_playway-${game_id}-player1_id`).val().trim() != "" && $(`#edit-game_playway-${game_id}-player1_money`).val().trim() != "" &&
    $(`#edit-game_playway-${game_id}-player2_id`).val().trim() != "" && $(`#edit-game_playway-${game_id}-player2_money`).val().trim() != ""
    
    ) {
    let game_playway = {
        id:game_id,
        banker_id: $(`#edit-game_playway-${game_id}-banker_id`).val(),
        banker_money: $(`#edit-game_playway-${game_id}-banker_money`).val(),
        player1_id: $(`#edit-game_playway-${game_id}-player1_id`).val(),
        player1_money: $(`#edit-game_playway-${game_id}-player1_money`).val(),
        player2_id: $(`#edit-game_playway-${game_id}-player2_id`).val(),
        player2_money: $(`#edit-game_playway-${game_id}-player2_money`).val()
    };
    $.ajax({
        type: "put",
        url: "/CMS/game_playway/edit",
        data: game_playway,
        success: function (res) {
            refresh_game_playwayUI();
        }
    })
} else {
    alert('欄位不可為空值')
}

}
function edit_game_playway_cancel(game_id,banker_id,banker_money,player1_id,player1_money,player2_id,player2_money,date) {
$(`#game_playwaytr-${game_id}`).empty();
$(`#game_playwaytr-${game_id}`).append(`<td>${game_id}</td>
            <td>${banker_id}</td>
            <td>${banker_money}</td>
            <td>${player1_id}</td>
            <td>${player1_money}</td>
            <td>${player2_id}</td>
            <td>${player2_money}</td>
            <td>${date}</td>
            <td><button onclick="edit_game_playway('${game_id}','${banker_id}','${banker_money}','${player1_id}','${player1_money}','${player2_id}','${player2_money}','${date}')" >修改</button>`+
            `<button onclick="del_game_playway('${game_id}')">刪除</button> </td>`);
}

function del_game_playway(game_id) {
if (confirm('確認刪除：'+game_id)) {
    let game_playway= {
        id:game_id
    }
    $.ajax({
        type: "delete",
        url: "/CMS/game_playway/del",
        data: game_playway,
        success: function (res) {
            refresh_game_playwayUI();
        }
    })
} else {
    
}

}