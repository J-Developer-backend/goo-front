import axios from 'axios'
export const HOST = '/api'

export const ERR_OK = 200;

// 获取个人信息
export function getUserProfile() {
    return axios.get(`${HOST}/users`);
}

// 更新数据
export function update(avatar, creatTime, email, phoneNumber, sex, username) {
    const params = new URLSearchParams();
    if (avatar) params.append("avatar", avatar);
    if (creatTime) params.append("creatTime", creatTime);
    if (email) params.append("email", email);
    if (phoneNumber) params.append("phoneNumber", phoneNumber);
    if (sex) params.append("sex", sex);
    if (username) params.append("username", username);

    return axios.put(`${HOST}/users/update?${params.toString()}`);
}

// 重置密码
export function resetPassword(data) {
    return axios.put(`${HOST}/users/resetPassword`, data);
}

export function payOrder(orderId) {
    const url = `${HOST}/pay/${orderId}`;
    return axios.get(url, {
        headers: {
            // 根据实际情况添加必要的认证信息
            'Content-Type': 'application/json',
        },
    });
}
/**
 * 获取所有订单
 * @param {string} status - 订单状态，可选参数
 * @returns {Promise} - 返回包含订单列表的 Promise
 */
export function getAllOrders(page, status) {
    const url = `${HOST}/orders`;
    return axios.get(url, { params: { page, status } });
}

/**
 * 取消订单
 * @param {number} orderId - 订单 ID
 * @returns {Promise} - 返回取消结果的 Promise
 */
export function cancelOrder(orderId) {
    const url = `${HOST}/orders/cancel`;
    return axios.put(url, { orderId });
}

/**
 * 确认订单完成
 * @param {number} orderId - 订单 ID
 * @returns {Promise} - 返回确认结果的 Promise
 */
export function finishOrder(orderId) {
    const url = `${HOST}/orders/finish`;
    return axios.put(url, { orderId });
}
/**
 * 获取商品详情
 * @param {number} itemId - 商品ID
 * @returns {Promise} - 返回商品详情的 Promise
 */
export function getItemDetails(itemId) {
    const url = `${HOST}/item/${itemId}`;
    return axios.get(url);
}

/**
 * 获取收藏数据
 * @param {number} page - 页码
 * @param {number} perSize - 每页条数
 * @returns {Promise} - 返回包含收藏数据的 Promise
 */
export function getFavorites(page, perSize) {
    const url = HOST + '/favorite';
    return axios.get(url, {
        params: {
            page,
            perSize
        }
    });
}

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