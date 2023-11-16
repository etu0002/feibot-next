import { Message } from "discord.js";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { threads } from "../db/schema";
import openai from "../lib/openai";
import { sanitizeMessageContent } from "./messages";
import util from "util";
import {
  RequiredActionFunctionToolCall,
  Run,
} from "openai/resources/beta/threads/runs/runs";
import { changeUserNickname, getCurrentTime, getWeather } from "./functions";
import { checkIfMessageIsDirectedAtBot } from "./bot";

const getAssistanceResponse = async (message: Message) => {
  const threadId = await createThread(message);
  console.log("THREAD ID", threadId);

  if (!threadId) return;

  const { messageDirectedAtBot } = await handleAssistanceResponse(
    threadId,
    message,
    true
  );

  if (!messageDirectedAtBot) return;

  const messages = await getThreadMessages(threadId);
  console.log("MESSAGES");
  consoleLog(
    messages.data.map((message) => {
      const role = message.role;
      const content =
        message.content[0]?.type === "text" ? message.content[0].text : "";

      return [role, content];
    })
  );

  const assistanceMessages = messages.data.filter(
    (message) => message.role === "assistant"
  );

  if (assistanceMessages.length) {
    const content = assistanceMessages[0]?.content[0];
    if (content?.type === "text") return content.text;
  }
};

const handleAssistanceResponse = async (
  threadId: string,
  message: Message,
  saveMessage?: boolean
) => {
  let messageDirectedAtBot = false;
  let runs = await openai.beta.threads.runs.list(threadId);
  let in_progress = ["in_progress", "queued"];
  let tries = 0;

  console.log("RUNS", message ? "has message" : "no message");
  consoleLog(runs.data.map((run) => [run.status, run.id]));

  while (
    runs.data.find((run) => in_progress.includes(run.status)) &&
    tries < 120
  ) {
    console.log("CHECKING RUNS");
    await new Promise((resolve) => setTimeout(resolve, 100));

    runs = await openai.beta.threads.runs.list(threadId);
    tries++;
  }

  if (runs.data.find((run) => run.status === "requires_action")) {
    const runRequiresActions = runs.data.filter(
      (run) => run.status === "requires_action"
    );
    console.log("RUNS REQUIRES ACTION");
    consoleLog(runRequiresActions);

    for (const run of runRequiresActions) {
      await handleThreadRunAction(run, threadId, message);
    }

    await handleAssistanceResponse(threadId, message);
  } else {
    if (saveMessage) {
      await storeThreadMessage(threadId, message);

      messageDirectedAtBot = await checkIfMessageIsDirectedAtBot(message);
      console.log("MESSAGE DIRECTED AT BOT", messageDirectedAtBot);

      if (!messageDirectedAtBot) return { messageDirectedAtBot };

      await createThreadRun(threadId);

      await handleAssistanceResponse(threadId, message);
    }
  }

  return { messageDirectedAtBot };
};

const consoleLog = (data: any) => {
  console.log(util.inspect(data, false, null, true));
};

const getFunctionOutput = async (
  name: string,
  args: string,
  message?: Message
) => {
  console.log("getFunctionOutput");

  switch (name) {
    case "get_weather":
      return await getWeather(args);
    case "change_user_nickname":
      return await changeUserNickname(args, message);
    case "get_current_time":
      return getCurrentTime(args);
    default:
      return;
  }
};

const handleThreadRunAction = async (
  run: Run,
  threadId: string,
  message?: Message
) => {
  if (run.required_action?.type === "submit_tool_outputs") {
    if (!run.required_action.submit_tool_outputs.tool_calls[0]) return;

    const output = await handleThreadRunActionCalls(
      threadId,
      run.id,
      run.required_action.submit_tool_outputs.tool_calls,
      message
    );

    if (!output) return;

    if (output) {
      await submitThreadRunOutput(threadId, run.id, output);
    }
  }
};

const handleThreadRunActionCalls = async (
  threadId: string,
  runId: string,
  toolCalls: RequiredActionFunctionToolCall[],
  message?: Message
) => {
  const result: { tool_call_id: string; output: string }[] = [];

  for (const toolCall of toolCalls) {
    if (toolCall.function?.name) {
      const output = await getFunctionOutput(
        toolCall.function.name,
        toolCall.function.arguments,
        message
      );

      if (output) {
        result.push({
          tool_call_id: toolCall.id,
          output,
        });
      }
    }
  }

  console.log("result");
  consoleLog(result);

  return result;
};

const submitThreadRunOutput = async (
  threadId: string,
  runId: string,
  tool_outputs: {
    tool_call_id: string;
    output: string;
  }[]
) => {
  return openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
    tool_outputs,
  });
};

const getThreadRun = async (runId: string, threadId: string) => {
  return openai.beta.threads.runs.retrieve(threadId, runId);
};

const createThreadRun = async (threadId: string) => {
  return openai.beta.threads.runs.create(threadId, {
    assistant_id: "asst_AprqPWiUyamgdub0YaqdTE81",
  });
};

const getThreadMessages = async (threadId: string) => {
  return openai.beta.threads.messages.list(threadId);
};

const storeThreadMessage = async (threadId: string, message: Message) => {
  const author = message.guild?.members.cache.get(message.author.id);

  return openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: `${
      author?.nickname || message.author.displayName
    }: ${sanitizeMessageContent(message.cleanContent)}`,
  });
};

const deleteThread = async (threadId: string) => {
  await openai.beta.threads.del(threadId);

  await db
    .update(threads)
    .set({ uuid: null })
    .where(eq(threads.uuid, threadId));
};

const createThread = async (message: Message) => {
  const server = message.guild;
  const channel = server?.channels.cache.find(
    (channel) => channel.id === message.channelId
  );

  if (!channel) return;

  let query = await db.query.threads
    .findFirst({
      where: (threads) =>
        and(
          eq(threads.channelUuid, channel.id),
          eq(threads.userUuid, message.author.id)
        ),
    })
    .execute();

  if (!query) {
    await db.insert(threads).values({
      channelUuid: channel.id,
      userUuid: message.author.id,
    });

    query = await db.query.threads
      .findFirst({
        where: (threads) =>
          and(
            eq(threads.channelUuid, channel.id),
            eq(threads.userUuid, message.author.id)
          ),
      })
      .execute();
  }

  if (!query?.uuid) {
    const thread = await openai.beta.threads.create({});

    await db
      .update(threads)
      .set({ uuid: thread.id })
      .where(
        and(
          eq(threads.channelUuid, channel.id),
          eq(threads.userUuid, message.author.id)
        )
      )
      .execute();

    return thread.id;
  }

  return query?.uuid;
};

export { getAssistanceResponse };
