import axios from 'axios'
export const HOST = '/api'

export const ERR_OK = 200;

/**
 * 上传图片
 * @param {File} file - 上传的文件对象
 * @returns {Promise} - 返回包含上传结果的 Promise
 */
export function uploadImage(file) {
    const url = HOST + '/upload';
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

/**
 * 提交商品表单
 * @param {Object} payload - 商品数据
 * @returns {Promise} - 返回包含提交结果的 Promise
 */
export function submitItem(payload) {
    const url = HOST + '/item';
    return axios.post(url, payload);
}

export function login(username, password) {
    const url = HOST + '/users/login';
    return axios.post(url, { username, password });
}

export function register(username, password) {
    const url = HOST + '/users/register';
    return axios.post(url, {
        username: username,
        password: password
    });
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