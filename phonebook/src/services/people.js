import axios from "axios";
const baseUrl = "/api/people";

const getAll = async () => {
	const request = axios.get(baseUrl);
	return request.then(res => res.data);
}

const create = async newObj => {
	const request = axios.post(baseUrl, newObj);
	return request.then(res => res.data);
}

const deleteEntry = async id => {
	const request = axios.delete(`${baseUrl}/${id}`)
	return request.then(res => res.data);
}

const update = async (id, newObj) => {
	const request = axios.put(`${baseUrl}/${id}`, newObj);
	return request.then(res => res.data);
}

export default { getAll, create, deleteEntry, update }
