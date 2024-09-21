import axios from "axios";

const BaseUrl = "https://iapitest.eva.guru/";

export const loginApi = (email: string, password: string) => {
  return axios.post(`${BaseUrl}oauth/token`, {
    Email: email,
    Password: password,
    GrantType: "password",
    Scope: "amazon_data",
    ClientId: "C0001",
    ClientSecret: "SECRET0001",
    RedirectUri: "https://api.eva.guru",
  });
};

export const fetchUserInfo = (token: string, email: string) => {
  return axios.post(
    `${BaseUrl}user/user-information`,
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
