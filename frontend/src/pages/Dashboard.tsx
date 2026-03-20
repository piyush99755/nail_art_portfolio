import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import type { NailArt } from '../types';

const Dashboard = () => {
    type EditableNailArt = NailArt & {
        file?:File;
    };

    //initial states
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [nailArts, setNailArts] = useState<NailArt[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editingNail, setEditingNail] = useState<EditableNailArt | null>(null);

    //this gives direct access to DOM element
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const itemToDelete = nailArts.find(art => art.id === deleteId);

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
            setPreview(null);

            //reset the input manually
            if(fileInputRef.current){
                fileInputRef.current.value = "";
            }
            //fetching existing nailarts 
            await fetchNailArts();
        }
        catch(error){
           console.error("File upload failed!!!", error);
        }
    };

    //fetching all nail arts..
    const fetchNailArts = async() => {
        try{
            const response = await api.get<NailArt[]>('/nail-arts/');
            setNailArts(response.data);
        }catch(error){
            console.error("Failed to fetch nail arts", error);
        }
    };

    //delete nail art by id
   /*  const handleDelete = (id: number) => {
        setDeleteId(id);
    };
 */
    const confirmDelete = async () =>{
        if(!deleteId) return;
        
        const idToDelete = deleteId;

        const previous = nailArts; // backup for rollback

        //Optimistic UI update
        setNailArts(prev => prev.filter(art => art.id !== deleteId));
        setDeleteId(null);

        try {
            await api.delete(`/nail-arts/${idToDelete}`);

        } catch(error){
            console.error("Delete failed", error);
            //Rollback if backend fails
            setNailArts(previous);
        }
    };

    const handleUpdate = async () => {
        if (!editingNail) return;

        const formData = new FormData();

        formData.append("title", editingNail.title);
        formData.append("description", editingNail.description);
        formData.append("category", editingNail.category);

        if (editingNail.file) {
            formData.append("file", editingNail.file);
        }

        try {
            await api.put(`/nail-arts/${editingNail.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            });

            setEditingNail(null);

            await fetchNailArts(); // refresh list
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    //load on page mount
    useEffect(() => {
        fetchNailArts();
    }, []);

    return (
        
        <div className='px-4'>
            {/* Upload form */}
            <div className="flex items-center justify-center min-h-[70vh]">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Admin Dashboard
            </h2>
            {success && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4 text-center">
                Upload successful!!!
                </div>
            )}

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
                ref={fileInputRef}
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
                className="w-full bg-brand-primary text-white py-2 rounded-lg hover:bg-black transition"
            >
                Upload Nail Art
            </button>
            </div>
            </div>

            {/* render existing nail arts */}
            <h3 className='text-xl font-semibold mt-12 mb-4'>
                Existing Nail Arts
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                { nailArts.map((art) => (
                    <div
                        key={art.id}
                        className='bg-white rounded-xl shadow-md overflow-hidden'
                    >
                        <img 
                            src={art.image_url} 
                            alt={art.title} 
                            className='w-full h-48 object-cover'
                        />
                        <div className='p-4'>
                            <h4 className='font-semibold'>{art.title}</h4>
                            <p className='text-sm text-gray-500 mb-3'>
                                {art.category}
                            </p>
                            <div className="flex gap-2">
                        <button
                            onClick={() => setEditingNail(art)}
                            className="flex-1 bg-gray-200 text-black py-1 rounded-lg hover:bg-gray-300 transition"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => setDeleteId(art.id)}
                            className="flex-1 bg-red-500 text-white py-1 rounded-lg hover:bg-red-600 transition"
                        >
                            Delete
                        </button>
                        </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add confirmation Modal UI */}
            {deleteId && (
                <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-sm'>
                        <h3 className='text-lg font-semibold mb-4'>
                            Confirm Delete
                        </h3>

                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete 
                            <span className='font-semibold'> { itemToDelete?.title }</span>?
                            This action cannot be undone.
                        </p>
                        <div className='flex justify-end  gap-3'>
                            <button
                                onClick = {() => setDeleteId(null)}
                                className='px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300'
                            >
                                Cancel
                            </button>

                            <button
                                onClick = { confirmDelete }
                                className='px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600'
                            >
                                Delete
                            </button>

                        </div>
                    </div>

                </div>
            )}

            {editingNail && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

                <h3 className="text-lg font-semibold mb-4">
                    Edit Nail Art
                </h3>

                <input
                    type="text"
                    value={editingNail.title}
                    onChange={(e) =>
                    setEditingNail({ ...editingNail, title: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-2 mb-3"
                />

                <input
                    type="text"
                    value={editingNail.category}
                    onChange={(e) =>
                    setEditingNail({ ...editingNail, category: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-2 mb-3"
                />

                <textarea
                    value={editingNail.description}
                    onChange={(e) =>
                    setEditingNail({ ...editingNail, description: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-2 mb-3"
                />

                {/* Image Upload */}
                <input
                    type="file"
                    onChange={(e) => {
                    if (e.target.files) {
                        setEditingNail({
                        ...editingNail,
                        file: e.target.files[0],
                        });
                    }
                    }}
                    className="mb-4"
                />

                <div className="flex justify-end gap-3">
                    <button
                    onClick={() => setEditingNail(null)}
                    className="px-4 py-2 rounded-lg bg-gray-200"
                    >
                    Cancel
                    </button>

                    <button
                    onClick={handleUpdate}
                    className="px-4 py-2 rounded-lg bg-brand-primary text-white hover:bg-black"
                    >
                    Save Changes
                    </button>
                </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default Dashboard;