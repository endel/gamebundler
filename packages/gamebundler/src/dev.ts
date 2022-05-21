import events from 'events';

export const rebuild = new events.EventEmitter();
export const isDevelopment = (process.env.NODE_ENV !== "production");