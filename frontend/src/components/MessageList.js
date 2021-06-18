import React, {useCallback, useEffect, useState} from "react";
import {SERVER_URL} from "../config";
import Message from "./Message";

const MessageList = ({message, parentId, level}) => {
    const [messages, setMessages] = useState([]);
    const [show, setShow] = useState(true);

    const fetchMessages = useCallback((parentId) => {
        let url = `${SERVER_URL}/messages`
        if (parentId) {
            url += `?parentId=${parentId}`
        }
        fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                accept: "application/json",
            }
        })
            .then(response => response.json())
            .then(data => setMessages(data))
            .then(() => setShow(false))
    }, [])

    const hideMessages = () => {
        setMessages([])
        setShow(true)
    }

    useEffect(() => {
        if (!message && messages.length <= 0) {
            fetchMessages(parentId)
            setShow(true)
        }
    }, [message, messages, fetchMessages, parentId]);

    return (
        <div style={{paddingLeft: `${level}%`}}>
            {message &&
            <Message
                operateReplies={show ? fetchMessages : hideMessages}
                show={show}
                id={message.id}
                key={message.id}
                author={message.author}
                createdAt={message.createdAt}
                lastModifiedAt={message.lastModifiedAt}
                content={message.content}
            />
            }
            {messages.map(message => (
                <MessageList
                    message={message}
                    level={level + 1}
                />
            ))}
        </div>
    );
}

export default MessageList;
