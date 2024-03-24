import axios from 'axios';

const fetchImages = async (ipfs) => {
    const promises = ipfs.map(e => axios.get(e).then(response => response.data));
  
    const results = await Promise.all(promises);
  
    return results
};

const ipfs = {
    fetchImages
};

export default ipfs;