/*
*  This is an automatically generated file.
*  Please do not modify this directly because any changes you make will be lost.
*  This file can be regenerated via:
*  $ roli generate-client . gateway
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* * --- File Information ---
* * Platform: 2.0.0-20240405102540-managedcloud-debug
* * Tools:    2.0.0-beta.7
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

import {createUuid, Data, Endpoint, Session, Event} from "roli-client";
import {__Session_InternalClient_Key, __Endpoint_InternalClient_Key, TypeRegistryBuilder, internalCreateClient} from "roli-client/internal";

export class ChatEntry extends Data {
    constructor(userName, text) {
        super(createUuid(false));
        this.userName = userName;
        this.text = text;
        this.timestamp = new Date();
    }
}

export class ChatEvent extends Event {
    constructor(entry) {
        super();
        this.entry = entry;
    }
}

export class ChatServer extends Endpoint {
    constructor(primaryKey) {
        super(primaryKey);
    }

    async say(userName, text) {
        return await Endpoint[__Endpoint_InternalClient_Key].callEndpointMethod(this, 100, userName, text);
    }

    async getHistory() {
        return await Endpoint[__Endpoint_InternalClient_Key].callEndpointMethod(this, 101);
    }

    async getTime() {
        return await Endpoint[__Endpoint_InternalClient_Key].callEndpointMethod(this, 102);
    }
}

export class GatewayApi extends Endpoint {
    constructor(primaryKey) {
        super(primaryKey);
    }

    async getSession(userName) {
        return await Endpoint[__Endpoint_InternalClient_Key].callEndpointMethod(this, 100, userName);
    }
}

export class GatewaySession extends Session {
    constructor(sessionId) {
        super(sessionId);
    }

    async setPromptMessage(message) {
        return await Session[__Session_InternalClient_Key].callSessionMethod(this, 100, message);
    }

    async tell(message) {
        return await Session[__Session_InternalClient_Key].callSessionMethod(this, 101, message);
    }
}



export function createRoliClient(options) {
    const registryBuilder = new TypeRegistryBuilder();
    const serviceKey = registryBuilder.registerService('gateway', false, 'pB8cV5PjS1gqNj/affTWphjZMRRZmCdOKoCgj1oBDRvdiC8pW71peWgrZelY1zKhvZXqv5CpZEuebKeJEkYZ6psxNBr6cP7n8OXmkD8Y4UX96SryMIsiW5nXaPzI0IaAYVwRsxiU5OgPQI5sKzsxGR6JXGEvBO4n6ouNbYKjFq9kqkkxve/0iYy1UBkjk95KoNuvnAzQc7Bse5ZWuhf40t9EGbpk/KOKZChKQGBRDsCfMGQHmXnTDSKU4sl9jF8n', '50215', '1');

    registryBuilder.registerData('ChatEntry', ChatEntry, serviceKey, 1001);
    registryBuilder.registerEvent('ChatEvent', ChatEvent, serviceKey, 1002);
    registryBuilder.registerEndpoint('ChatServer', ChatServer, serviceKey, 1000);
    registryBuilder.registerEndpoint('GatewayApi', GatewayApi, serviceKey, 1003);
    registryBuilder.registerSession('GatewaySession', GatewaySession, serviceKey, 1004);
    return internalCreateClient(registryBuilder.build(), "https://api.roli.app/", options);
}

