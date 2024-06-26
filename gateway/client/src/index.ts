#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';

import { ServiceOptions } from 'roli-client';
import {
  createRoliClient,
  ChatServer,
  ChatEntry,
  ChatEvent,
  GatewayApi,
  GatewaySession,
} from 'gateway-service'; // Assuming you have combined the classes in a file named 'config.ts'

const roli = createRoliClient(new ServiceOptions(false, false));

const chatServer = roli.getEndpoint(
  ChatServer,
  "Abhishek Sagar's Dynamic Chatbot./"
);
const gatewayApi = roli.getEndpoint(GatewayApi, 'default');

console.clear();
console.log(`Welcome to ${chalk.blueBright(chatServer.primaryKey)}!`);
console.log(
  chalk.grey(`The current server time is ${await chatServer.getTime()}.`)
);

const args = process.argv.slice(2);
if (args[0] === '--console') {
  const history = await chatServer.getHistory();
  if (history && history.length) {
    console.log('== Chat History ==');
    for (const chatEntry of history) outputChatEntry(chatEntry);
  }

  console.log('\nPress Ctrl+C to exit.\n');

  await roli.subscribeEvent(chatServer, ChatEvent, (chatEvent: ChatEvent) => {
    outputChatEntry(chatEvent.entry);
  });
} 
// else if(args[0] === '--contactus'){
// //neeed.  tooooo writeeeeee
// } 
else {
  const{channel}=await inquirer.prompt([
    {
      type:'input',
      name:'channel',
      message:'Choose between Customer Care and Dynamic Chatbot: type "customer care" for Customer Care or "dynamic chatbot" for Dynamic Chatbot'
    }
  ]);
  if(channel=='customer care'){
    const { userName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'userName',
        message: 'Login: ',
      }
    ]);
    const promptMessage='Act as a customer care executive with years of experience, answering '+userName+' questions on Abhishek’s Dynamic Chatbot in a formal and professional manner. Only answer questions related to Abhishek’s Dynamic Chatbot. Any other inquiries, ask to contact the owner at "sanda.a@northeastern.edu". Utilize previous responses as needed. Abhishek’s Dynamic Chatbot was a versatile tool that could be tailored to any field by answering three simple questions: how you wanted it to behave, what topic it specialized in, and what tone it should use. Users could access their chat history by running the command `npm run console` and logging in with their username. To exit the chatbot window, users could type `/quit`, and to exit the chat history, they could use Ctrl+C. The chatbot would only respond to questions within the specified field and ignore those outside its expertise.'    
    console.log('Username: ' + userName);
  const session = await gatewayApi.getSession(userName);
  session.setPromptMessage(promptMessage);
  
  console.log(
    `You are speaking with a chatbot. Your session ID is ${session.sessionId}. Use /quit to exit chat.`
  );
  

  while (true) {
    await inquirer
      .prompt([
        {
          type: 'input',
          name: 'text',
          message: `${userName}: `,
        },
      ])
      .then(async ({ text }) => {
        if (text === '/quit') {
          process.exit(0);
          return;
        } else {
          await chatServer.say(userName, text);
          const response = await session.tell(text);
          const timestamp = chalk.grey(`[${new Date().toLocaleTimeString()}]`);
          const userName_1 = chalk.whiteBright(`[chatbot]:`);

          const t = chalk.greenBright(response);
          await chatServer.say(userName_1, t);
          console.log(`${timestamp} ${userName_1} ${t}`);
        }
      });
    }
  }
  else if(channel=='dynamic chatbot'){
  const { userName, context, topic, quality } = await inquirer.prompt([
    {
      type: 'input',
      name: 'userName',
      message: 'Login: ',
    },
    {
      type: 'input',
      name: 'context',
      message:
        'How do you want your chatbot to behave? (example: Resume writer, Taylor Swift):',
    },
    {
      type: 'input',
      name: 'topic',
      message:
        'What topic should the chatbot specialize in? (example: Resume writing, Taylor Swift):',
    },
    {
      type: 'input',
      name: 'quality',
      message:
        'What tones do you prefer the chatbot to use? [seperate with , if using more than 1 tone] (example: professional, polite, informal):',
    },
  ]);
  const promptMessage =
    'Act as a ' +
    context +
    ' with several years of experience, answering ' +
    userName +
    '’s questions on ' +
    topic +
    ' in a ' +
    quality +
    ' manner. Only respond to inquiries related to ' +
    topic +
    ' and refrain from addressing unrelated topics. Utilize previous responses when necessary.';

  console.log('Username: ' + userName);
  const session = await gatewayApi.getSession(userName);
  session.setPromptMessage(promptMessage);
  
  console.log(
    `You are speaking with a chatbot. Your session ID is ${session.sessionId}. Use /quit to exit chat.`
  );
  

  while (true) {
    await inquirer
      .prompt([
        {
          type: 'input',
          name: 'text',
          message: `${userName}: `,
        },
      ])
      .then(async ({ text }) => {
        if (text === '/quit') {
          process.exit(0);
          return;
        } else {
          await chatServer.say(userName, text);
          const response = await session.tell(text);
          const timestamp = chalk.grey(`[${new Date().toLocaleTimeString()}]`);
          const userName_1 = chalk.whiteBright(`[chatbot]:`);

          const t = chalk.greenBright(response);
          await chatServer.say(userName_1, t);
          console.log(`${timestamp} ${userName_1} ${t}`);
        }
      });
    }
  }
  else{
    process.exit(0);
  }
}

function outputChatEntry(entry: ChatEntry) {
  const timestamp = chalk.grey(`[${entry.timestamp.toLocaleTimeString()}]`);
  const userName = chalk.whiteBright(`[${entry.userName}]:`);
  const text = chalk.greenBright(entry.text);
  console.log(`${timestamp} ${userName} ${text}`);
}
