import { authClient } from '@/lib/auth/client';
import { keysLocalStorage } from '@/ultils/local-storege';
import axios from 'axios';

const axiosConfig = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosConfig.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        const token = localStorage.getItem('custom-auth-token');

        if (!token || token === '' || token === 'null') {
            return config;
        } else {
            config.headers.Authorization = 'Bearer ' + token;
        }

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
axiosConfig.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data

        console.log('response', response);
        return response;
    },
    async function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        const refreshToken = localStorage.getItem(keysLocalStorage.refresh);

        const { response, config } = error;
        const status = response?.status;

        // Kiểm tra mã lỗi có phải là 401 hoặc 403 hay không
        if (status === 502) {
            // Chúng ta sẽ Thực hiện kịch bản refresh token tại đây
            try {
                const res = await axiosConfig({
                    method: 'POST',
                    url: 'auths/refresh-token?type=admin',
                    data: {
                        refreshToken: refreshToken,
                    },
                });

                if (res) {
                    const { token, refreshToken } = res.data.data;

                    localStorage.setItem(keysLocalStorage.token, token);
                    localStorage.setItem(keysLocalStorage.refresh, refreshToken);

                    config.headers.Authorization = `Bearer ${token}`;
                    return axiosConfig(config);
                }
            } catch (error) {
                authClient.signOut();
                window.location.reload();
                return Promise.reject(error);
            }
        }

        // Nếu không, trả lỗi về điểm cuối đã gọi api
        return Promise.reject(error);
    },
);

export default axiosConfig;
