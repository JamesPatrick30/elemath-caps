export interface PubSubEvents {
    FILE_UPLOAD: 'file-upload',
    SOCKET_EVENT: 'socket-event',
}

export interface PubSubSocketEvents {
    event: string;
    payload: any;
    room?: string;
}