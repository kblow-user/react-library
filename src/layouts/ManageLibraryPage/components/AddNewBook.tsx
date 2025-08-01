import { useState } from 'react';
import AddBookRequest from '../../../models/AddBookRequest';
import { useAuth0 } from '@auth0/auth0-react';

export const AddNewBook = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    // New Book
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function categoryField(value: string) {
        setCategory(value);
    }

    async function base64ConversionForImages(e: any) {
        if (e.target.files[0]) {
            getBase64(e.target.files[0]);
        }
    }

    function getBase64(file: any) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setSelectedImage(reader.result);
        };
        reader.onerror = function (error) {
            console.error('Error', error);
        };
    }

    async function submitNewBook() {
        if (!isAuthenticated || title === '' || author === '' || category === 'Category' || description === '' || copies < 0) {
            setDisplayWarning(true);
            setDisplaySuccess(false);
            return;
        }

        try {
            const token = await getAccessTokenSilently();
            const url = `https://localhost:8443/api/admin/secure/add/book`;

            const book: AddBookRequest = new AddBookRequest(title, author, description, copies, category);
            book.img = selectedImage;

            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            };

            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            // Reset fields and show success message
            setTitle('');
            setAuthor('');
            setDescription('');
            setCopies(0);
            setCategory('Category');
            setSelectedImage(null);
            setDisplayWarning(false);
            setDisplaySuccess(true);

        } catch (error: any) {
            console.error('Error submitting book:', error.message);
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess && 
                <div className='alert alert-success' role='alert'>
                    Book added successfully
                </div>
            }
            {displayWarning && 
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out correctly
                </div>
            }
            <div className='card'>
                <div className='card-header'>
                    Add a new book
                </div>
                <div className='card-body'>
                    <form method='POST'>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Title</label>
                                <input type="text" className='form-control' name='title' required 
                                    onChange={e => setTitle(e.target.value)} value={title} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Author </label>
                                <input type="text" className='form-control' name='author' required 
                                    onChange={e => setAuthor(e.target.value)} value={author}/>
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Category</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button' 
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                        {category}
                                </button>
                               <ul id='addNewBookId' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
    <li>
        <button type="button" onClick={() => categoryField('FE')} className='dropdown-item'>
            Front End
        </button>
    </li>
    <li>
        <button type="button" onClick={() => categoryField('BE')} className='dropdown-item'>
            Back End
        </button>
    </li>
    <li>
        <button type="button" onClick={() => categoryField('Data')} className='dropdown-item'>
            Data
        </button>
    </li>
    <li>
        <button type="button" onClick={() => categoryField('DevOps')} className='dropdown-item'>
            DevOps
        </button>
    </li>
</ul>

                            </div>
                        </div>
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea className='form-control' rows={3} 
                                onChange={e => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Copies</label>
                            <input type='number' className='form-control' name='Copies' required 
                                onChange={e => setCopies(Number(e.target.value))} value={copies}/>
                        </div>
                        <input type='file' onChange={e => base64ConversionForImages(e)}/>
                        <div>
                            <button type='button' className='btn btn-primary mt-3' onClick={submitNewBook}>
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
