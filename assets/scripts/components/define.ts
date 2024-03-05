export const defines = {
    serverUrl: "http://localhost:3000",
};

export const isopen_sound = 1;

export const qian_state = {
    buqiang: 0,
    qian: 1,
};

export const RoomState = {
    ROOM_INVALID: -1,
    ROOM_WAITREADY: 1,
    ROOM_GAMESTART: 2,
    ROOM_PUSHCARD: 3,
    ROOM_ROBSTATE: 4,
    ROOM_SHOWBOTTOMCARD: 5,
    ROOM_PLAYING: 6,
};

export const createRoomConfig = {
    '1': {
        needCostGold: 100,
        bottom: 100,
        rate: 1
    },
    '2': {
        needCostGold: 1000,
        bottom: 500,
        rate: 2
    }
};

// 牌型定义
export const CardsValue = {
    one: {
        name: 'One',
        value: 1
    },
    double: {
        name: 'Double',
        value: 1
    },
    three: {
        name: 'Three',
        value: 1
    },
    boom: {
        name: 'Boom',
        value: 2
    },
    threeWithOne: {
        name: 'ThreeWithOne',
        value: 1
    },
    threeWithTwo: {
        name: 'ThreeWithTwo',
        value: 1
    },
    plane: {
        name: 'Plane',
        value: 1
    },
    planeWithOne: {
        name: 'PlaneWithOne',
        value: 1
    },
    planeWithTwo: {
        name: 'PlaneWithTwo',
        value: 1
    },
    scroll: {
        name: 'Scroll',
        value: 1
    },
    doubleScroll: {
        name: 'DoubleScroll',
        value: 1
    },
    kingboom: {
        name: 'kingboom',
        value: 3
    }
};