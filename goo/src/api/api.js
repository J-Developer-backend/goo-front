import axios from 'axios'
export const HOST = '/api'

export const ERR_OK = 200;

export function login(username, password) {
    const url = HOST + '/users/login';
    return axios.post(url, { username, password });
}
export function getSearchResult({ itemName = '', page = 0, pageSize = 10, categoryId = '', location = '', maxPrice = '', minPrice = '' }) {
    const url = HOST + '/item/pageQuery';

    // 过滤掉空字符串的参数
    const params = {
        itemName,
        page,
        pageSize,
        categoryId,
        location: location || undefined,
        maxPrice: maxPrice || undefined,
        minPrice: minPrice || undefined
    };

    return axios.get(url, { params });
}
export function uploadItem(file) {
    const url = HOST + '/upload';
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}
export function getItems() {
    const url = HOST + '/item'
    return axios.get(url)
}
export function getCategory() {
    const url = HOST + '/api/v1/items/search'
    return axios.get(url)
}