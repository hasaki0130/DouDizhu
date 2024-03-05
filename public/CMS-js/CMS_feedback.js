// var feedback;
function refresh_feedbackUI() {
    $.get("/CMS/feedback", async function (e) {
        let html = '';
        await e.forEach((doc) => {
            html += `<tr id="feedbacktr-${doc.id}">
                              <td rowspan="${doc.data.message.length*2}">${doc.id}</td>`
                    doc.data.message.forEach((m,i)=>{
                        html+=`<td>${m.user_message}</td>
                                <td>${new Date(m.user_message_date._seconds * 1000).toLocaleString()}</td> 
                            </tr>
                            <tr class="tablesorter-childRow">
                                <td><p>${m.reply_message}</p><br><button onclick="edit_feedback(this,'${doc.id}',${i})">回覆</button></td>
                                <td>${new Date(m.reply_message_date._seconds * 1000).toLocaleString()}</td>
                            </tr>
                            <tr class="tablesorter-childRow">`
                    })
                    html.slice(0,-33)
        });
        
        $('#feedback-tbody').empty();
        $('#feedback-tbody').append(html);
        $("#feedback-table").trigger('update');
    });
}
function edit_feedback(this_button, user_id, i) {
    let feedback_text = $(this_button).prev().prev().text();
    $(this_button).closest("td").html(`<input type="text" value="${feedback_text}"><br>` +
        `<button onclick="feedback_confirm(this,'${user_id}','${i}')">確定</button>` +
        `<button  onclick="feedback_cancel(this,'${feedback_text}','${user_id}',${i})">取消</button>`)
}
function feedback_confirm(this_button, user_id, i) {
    let feedback_text = $(this_button).prev().prev().val();
    let feedback_data = {
        id: user_id,
        index:i,
        message:feedback_text
    };
    $.ajax({
        type: "put",
        url: "/CMS/feedback/edit",
        data: feedback_data,
        success: function (res) {
            refresh_feedbackUI();
        }
    })
    $(this_button).closest("td").html(`<p>${feedback_text}</p><br><button onclick="edit_feedback(this,'${user_id}',${i})">回覆</button>`);
}
function feedback_cancel(this_button, feedback_text, user_id, i) {
    $(this_button).closest("td").html(`<p>${feedback_text}</p><br><button onclick="edit_feedback(this,'${user_id}',${i})">回覆</button>`);
}