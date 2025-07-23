// src/layouts/Message/components/PostNewMessage.tsx

import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import MessageModel from '../../../models/MessageModel';

export const PostNewMessage = () => {

  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  const submitNewQuestion = async () => {
    if (!isAuthenticated || title.trim() === '' || question.trim() === '') {
      setDisplayWarning(true);
      setDisplaySuccess(false);
      return;
    }

    try {
      const token = await getAccessTokenSilently();

      const messageRequestModel: MessageModel = new MessageModel(title, question);

      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageRequestModel)
      };

      const response = await fetch('https://localhost:8443/api/messages/secure/add/message', requestOptions);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      setTitle('');
      setQuestion('');
      setDisplayWarning(false);
      setDisplaySuccess(true);
    } catch (error) {
      console.error('Error submitting question:', error);
      setDisplayWarning(true);
      setDisplaySuccess(false);
    }
  };

  return (
    <div className='card mt-3'>
      <div className='card-header'>Ask a question to Luv 2 Read Admin</div>
      <div className='card-body'>
        <form>
          {displayWarning && (
            <div className='alert alert-danger' role='alert'>
              All fields must be filled out and you must be logged in
            </div>
          )}
          {displaySuccess && (
            <div className='alert alert-success' role='alert'>
              Question added successfully
            </div>
          )}
          <div className='mb-3'>
            <label className='form-label'>Title</label>
            <input
              type='text'
              className='form-control'
              placeholder='Title'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label className='form-label'>Question</label>
            <textarea
              className='form-control'
              rows={3}
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
          </div>
          <button
            type='button'
            className='btn btn-primary mt-3'
            onClick={submitNewQuestion}
          >
            Submit Question
          </button>
        </form>
      </div>
    </div>
  );
};
