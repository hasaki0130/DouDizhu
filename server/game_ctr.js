const Player = require("./player.js")
const Room = require("./room.js")
const config = require("../defines.js")

var _player_list = []
var _room_info = []

exports.create_player = function (playinfo, socket, callindex) {
    var player = Player(playinfo, socket, callindex, this)
    _player_list.push(player)
    // console.log(_player_list[0])
    
}

exports.create_room = function (roominfo, own_player, callback) {
    var room = Room(roominfo, own_player)
    _room_info.push(room)
    // console.log(room)
    //检测用户是否能创建房间
    //检查金币数量是否足够

    var needglobal = config.createRoomConfig[roominfo.rate].needCostGold
    console.log("create room needglobal:" + needglobal)

    if (own_player._money < needglobal) {
        callback(-1, {})
        return
    }
    room.jion_player(own_player)
    if (callback) {
        callback(0, {
            room: room,
            data: {
                roomid: room.room_id,
                bottom: room.bottom,
                rate: roominfo.rate
            }
        })
    }

}


//notify{"type":"joinroom_resp","result":null,"data":{"data":{"roomid":"714950","gold":100}},"callBackIndex":3}
exports.jion_room = function (data, player, callback) {
    //console.log("jion_room AA"+data.roomid)
    for (var i = 0; i < _room_info.length; ++i) {
        //console.log("_room_info[i] BB:"+_room_info[i].room_id)
        if (_room_info[i].room_id === data.roomid) {
            //console.log("----jion_room sucess roomid:"+data.roomid)
            _room_info[i].jion_player(player)
            if (callback) {
                resp = {
                    room: _room_info[i],
                    data: {
                        roomid: _room_info[i].room_id,
                        bottom: _room_info[i].bottom,
                        rate: _room_info[i].rate,
                        gold: _room_info[i].gold,
                    }
                }
                callback(0, resp)
                return
            }
        }
    }

    if (callback) {
        callback("no found room:" + data.roomid)
    }
} 
