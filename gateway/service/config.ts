import {
  createUuid,
  saveData,
  fireEvent,
  Event,
  Data,
  Endpoint,
  Session,
  createSession,
  getModel,
  ChatModelResponse,
  Prompt,
  Program,
  Step,
  Instruction,
} from './roli-runtime';

export class ChatServer extends Endpoint {
  private _history: ChatEntry[];
  constructor(name: string) {
    super(name);
    this._history = [];
  }

  say(userName: string, text: string) {
    const entry = new ChatEntry(userName, text);
    this._history.push(entry);
    saveData(entry); // Save data object to datastore
    fireEvent(this, new ChatEvent(entry)); // Send SSE to listening clients
  }

  getHistory(): ChatEntry[] {
    return this._history;
  }

  getTime(): Date {
    return new Date();
  }
}

export class ChatEntry extends Data {
  public readonly timestamp: Date;
  constructor(public readonly userName: string, public readonly text: string) {
    super(createUuid(false));
    this.timestamp = new Date();
  }
}

export class ChatEvent extends Event {
  constructor(public entry: ChatEntry) {
    super();
  }
}

export class GatewayApi extends Endpoint {
  constructor(primaryKey: string) {
    super(primaryKey);
  }
  getSession(userName: string): GatewaySession {
    const session = createSession(GatewaySession);
    session.userName = userName;
    return session;
  }
}

export class GatewaySession extends Session {
  prompt_message: string;
  private _history: Instruction[];
  userName: string | null;
  constructor(sessionId: string) {
    super(sessionId);
    this.userName = null;
    this._history = [];
    this.prompt_message = '';
  }

  setPromptMessage(message: string): void {
    this.prompt_message = message;
  }

  async tell(message: string): Promise<string | null> {
    const model = getModel('my-model');
    let steps: Step[];
    if (this._history) {
      steps = Array.from(this._history);
    } else {
      steps = [];
    }

    let result: string | null = null;
    const prompt = {
      user: message,
      assistant: (response: ChatModelResponse) => {
        result = response.choices[0].message.content;
        return result;
      },
    } as Prompt;
    if (this._history.length === 0) {
      prompt.system = this.prompt_message;
    }
    steps.push(prompt);

    const program = new Program(model, steps);
    this._history.push(program.steps.peek() as Instruction);
    await this.execute(program);
    return result;
  }
}
