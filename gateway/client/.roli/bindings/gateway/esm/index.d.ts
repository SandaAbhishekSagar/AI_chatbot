import { ServiceOptions, RoliClient } from "roli-client";
import { Event, Data, Endpoint, Session } from "roli-client";
export declare class ChatServer extends Endpoint {
    constructor(name: string);
    say(userName: string, text: string): Promise<void>;
    getHistory(): Promise<ChatEntry[]>;
    getTime(): Promise<Date>;
}
export declare class ChatEntry extends Data {
    readonly userName: string;
    readonly text: string;
    readonly timestamp: Date;
    constructor(userName: string, text: string);
}
export declare class ChatEvent extends Event {
    entry: ChatEntry;
    constructor(entry: ChatEntry);
}
export declare class GatewayApi extends Endpoint {
    constructor(primaryKey: string);
    getSession(userName: string): Promise<GatewaySession>;
}
export declare class GatewaySession extends Session {
    constructor(sessionId: string);
    setPromptMessage(message: string): Promise<void>;
    tell(message: string): Promise<Promise<string | null>>;
}

export declare function createRoliClient(options?: ServiceOptions) : RoliClient;
