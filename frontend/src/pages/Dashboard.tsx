import { useState } from 'react';
import api from '../api/axios';

const Dashboard = () => {

    //initial state
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async() => {
        if(!file){
            alert('Please select an image!!!');
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("file", file);

        try {
            await api.post("/nail-arts/", formData);
            alert("Upload Successful!");

            setTitle("");
            setDescription("");
            setCategory("");
            setFile(null);
        }
        catch(error){
            alert("File upload failed!!!");
        }
    };
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <input 
                type="text"
                placeholder='Title'
                value = {title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input 
                type="text" 
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <input 
                type="text"
                placeholder='category'
                value={category}
                onChange={(e) => setCategory(e.target.value)} 
            />

            <input 
                type="file" 
                onChange={(e) => {
                    if(e.target.files){
                        setFile(e.target.files[0])
                    }
                }}
            />
            
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default Dashboard;