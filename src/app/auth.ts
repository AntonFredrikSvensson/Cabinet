export interface AuthObj{
    isAuth?: boolean;
    accessToken?: string;
    tokenType?: string;
    uid?: string;
    accountId?: string;
    expires_in?: string;
    scope?: string;
    authuser?: string; // boolean?
    prompt?: string;
}
