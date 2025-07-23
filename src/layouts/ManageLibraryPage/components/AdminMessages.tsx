import { useEffect, useState } from 'react';
import MessageModel from '../../../models/MessageModel';
import { Pagination } from '../../Utils/Pagination';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { AdminMessage } from './AdminMessage';
import { useAuth0 } from '@auth0/auth0-react';
import AdminQuestionRequest  from '../../../models/AdminQuestionRequest';

export const AdminMessages = () => {

    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [btnSubmit, setBtnSubmit] = useState(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (!isAuthenticated) return;

            try {
                const token = await getAccessTokenSilently();
                const url = `https://localhost:8443/api/messages/search/findByClosed/?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                };

                const messagesResponse = await fetch(url, requestOptions);
                if (!messagesResponse.ok) {
                    throw new Error('Something went wrong!');
                }

                const messagesResponseJson = await messagesResponse.json();

                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            } catch (error: any) {
                setHttpError(error.message || 'Error fetching messages');
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchUserMessages();
        window.scrollTo(0, 0);
    }, [getAccessTokenSilently, isAuthenticated, currentPage, btnSubmit,messagesPerPage]);

    if (isLoadingMessages) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    async function submitResponseToQuestion(id: number, response: string) {
        if (!isAuthenticated || !response || id == null) return;

        try {
            const token = await getAccessTokenSilently();
            const url = `http://localhost:8080/api/messages/secure/admin/message`;

            const messageAdminRequestModel = new AdminQuestionRequest(id, response);

            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequestModel)
            };

            const messageAdminRequestModelResponse = await fetch(url, requestOptions);
            if (!messageAdminRequestModelResponse.ok) {
                throw new Error('Something went wrong!');
            }

            setBtnSubmit(!btnSubmit);
        } catch (error: any) {
            setHttpError(error.message || 'Error submitting response');
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-3'>
            {messages.length > 0 ?
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage
                            message={message}
                            key={message.id}
                            submitResponseToQuestion={submitResponseToQuestion}
                        />
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                />
            )}
        </div>
    );
};
