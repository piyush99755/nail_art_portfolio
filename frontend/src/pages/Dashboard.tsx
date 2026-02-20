import { useState } from 'react';
import api from '../api/axios';

const Dashboard = () => {

    //initial states
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleUpload = async() => {

        if(!file){
            alert('Please select an image!!!');
            return;
        }

        const formData = new FormData();

        //adding key-value pairs into the FormData object...
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("file", file);

        try {
            await api.post("/nail-arts/", formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            setTitle("");
            setDescription("");
            setCategory("");
            setFile(null);
        }
        catch(error){
           console.error("File upload failed!!!", error);
        }
    };
    return (
        
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Admin Dashboard
            </h2>

            <p className="text-sm text-gray-500 text-center mb-6">
                Upload new nail art designs to showcase on your portfolio.
            </p>


            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <input
                type="file"
                className="w-full mb-6"
                onChange={(e) => {
                if (e.target.files) {
                    const selectedFile = e.target.files[0];
                    setFile(selectedFile);
                    setPreview(URL.createObjectURL(selectedFile));
                }
                }}
                />
                {preview && (
                <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg mb-4"
                />
                )}

            
            <button
                onClick={handleUpload}
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
            >
                Upload Nail Art
            </button>
            </div>
        </div>
    );

};

export default Dashboard;