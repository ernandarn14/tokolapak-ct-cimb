export const getIdCart = (item) => {
    return {
        type: "GET_ID",
        payload: item,
    };
};