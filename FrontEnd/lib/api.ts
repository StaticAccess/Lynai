import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000';
const WS_BASE_URL = 'ws://127.0.0.1:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

export const createChatRoom = async (password: string) => {
  try {
    const response = await api.post('/create-room', { password })
    return {success: true, roomId: response.data.roomId}
  } catch (error) {
    console.error('Error creating chat room:', error)
    return { success: false, error: 'Failed to create chat room' }
  }
}

export const joinChatRoom = async (roomId: string, password: string) => {
  try {
    const response = await api.post('/join-room', { roomId, password })
    return response.data
  } catch (error) {
    console.error('Error joining chat room:', error)
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data
    }
    return { success: false, error: 'Failed to join chat room' }
  }
}



export const changeUsername = async (roomId: string, newUsername: string) => {
  try {
    const response = await api.post(`/change-username/${roomId}`, { new_username: newUsername })
    if (response.data.success) {
      return { success: true, message: response.data.message }
    } else {
      throw new Error(response.data.detail || 'Failed to change username')
    }
  } catch (error) {
    console.error('Error changing username:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to change username' }
  }
}

export const setDeleteTimer = async (roomId: string, duration: string) => {
  try {
    const response = await api.post(`/set-delete-timer/${roomId}`, { duration })
    return response.data
  } catch (error) {
    console.error('Error setting delete timer:', error)
    return { success: false, error: 'Failed to set delete timer' }
  }
}

export const downloadChat = async (roomId: string, format: 'txt' | 'json') => {
  try {
    const response = await api.get(`/database/download-chat/${roomId}`, {
      params: { format },
      responseType: 'blob',
    })
    const blob = new Blob([response.data], { type: format === 'txt' ? 'text/plain' : 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `chat_${roomId}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    return { success: true }
  } catch (error) {
    console.error('Error downloading chat:', error)
    return { success: false, error: 'Failed to download chat' }
  }
}

export const createWebSocketConnection = (roomId: string) => {
  return new WebSocket(`${WS_BASE_URL}/ws/${roomId}`);
};

export const sendWebSocketMessage = (ws: WebSocket, username: string, message: string, type: 'text' | 'emoji' = 'text') => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ username, message, type }));
  } else {
    console.error('WebSocket is not open. Current state:', ws.readyState);
    
  }
};

export const importDatabase = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/database/import-database', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error importing database:', error);
    return { success: false, error: 'Failed to import database' };
  }
};

export const getDatabase = async (roomId: string) => {
  try {
    const response = await api.get(`/database/get-database/${roomId}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `chat_room_${roomId}.db`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return { success: true };
  } catch (error) {
    console.error('Error getting database:', error);
    return { success: false, error: 'Failed to get database' };
  }
};

export const importChat = async (roomId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/database/import-chat/${roomId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error importing chat:', error);
    return { success: false, error: 'Failed to import chat' };
  }
};

export const deleteRoom = async (roomId: string) => {
  try {
    const response = await api.delete(`/delete-room/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting room:', error);
    return { success: false, error: 'Failed to delete room' };
  }
};
