type AuthAction =
  | { type: "RESTORE_TOKEN"; paylaod: string | null }
  | { type: "SIGN_IN"; paylaod: string }
  | { type: "SIGN_OUT" };

export type AuthState = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
};

export const AuthInitialState: AuthState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
};

export function AuthReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...state,
        userToken: action.paylaod,
        isLoading: false,
      };
    case "SIGN_IN":
      return {
        ...state,
        isSignout: false,
        userToken: action.paylaod,
      };
    case "SIGN_OUT":
      return {
        ...state,
        isSignout: true,
        userToken: null,
      };
    default:
      action satisfies never;
      return state;
  }
}
