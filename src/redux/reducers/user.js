import userTypes from "../types/user"

const init_state = {
  id: 0,
  username: "",
  fullName: "",
  address: {},
  role: "",
  errMsg: ""
};



const { ON_LOGIN_SUCCESS, ON_LOGIN_FAIL, ON_LOGOUT_SUCCESS, ON_REGISTER_FAIL } = userTypes

export default (state = init_state, action) => {
  switch (action.type) {
    case ON_LOGIN_SUCCESS:
      const { username, fullName, role, id } = action.payload;
      return {
        ...state,
        username,
        fullName,
        role,
        id,
      };
    case ON_LOGIN_FAIL:
      return { ...state, errMsg: action.payload }
    case ON_LOGOUT_SUCCESS:
      return { init_state }
    case ON_REGISTER_FAIL:
      return { ...state, errMsg: action.payload }
    default:
      return { ...state };
  }

};
