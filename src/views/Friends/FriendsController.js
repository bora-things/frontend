import api from "@/config/axios.config";

// Função para buscar pessoas gerais (todos os estudantes)
export async function getGeneralPeople(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.studentName) {
        queryParams.append('studentName', params.studentName);
    }
    if (params.page !== undefined) {
        queryParams.append('page', params.page);
    }
    if (params.size !== undefined) {
        queryParams.append('size', params.size);
    }
    
    const response = await api.get(`/api/students?${queryParams.toString()}`);
    return response.data;
}

// Função para buscar apenas amigos confirmados
export async function getFriends(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.studentName) {
        queryParams.append('studentName', params.studentName);
    }
    
    if (params.page !== undefined) {
        queryParams.append('page', params.page);
    }
    if (params.size !== undefined) {
        queryParams.append('size', params.size);
    }
    
    const response = await api.get(`/api/students/me/friends?${queryParams.toString()}`);
    return response.data;
}