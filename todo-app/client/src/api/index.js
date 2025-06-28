import apiClient from "./axios.js"

const getReq = async (path, config = {}) => {
  try {
    const response = await apiClient.get(path, config);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow so caller can handle it
  }
};


const postReq = async (path,data) => {
    try {
      const response = await apiClient.post(path,data);
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; 
    }
  };
  

 const deleteReq = async (path, data = {}) => {
  try {
    const response = await apiClient.delete(path, {
      data, // Axios needs this for DELETE body
    });
    return response;
  } catch (error) {
    console.error("Error Deleting data:", error);
  }
};


  
  const putReq = async (path,data) => {
    try {
      const response = await apiClient.put(path,data);
      return response;
    } catch (error) {
      console.error("Error Updating data:", error);
    }
  };
  
  export {getReq, putReq, deleteReq,postReq}