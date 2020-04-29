const init_state = {
    userId: 0,
    productId: 0,
    qty: 0,
    id: 0
}

export default (state = init_state, action) => {
    if (action.type == "GET_ID") {
        return { ...state, id: action.payload };
    } else {
        return { ...state };
    }
}