#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import nodemailer from "nodemailer";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

const server = new Server(
  { name: "mcp-email", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "send_email",
      description:
        "Send an email via Gmail SMTP. Supports plain text, HTML body, and file attachments.",
      inputSchema: {
        type: "object",
        properties: {
          to: {
            type: "string",
            description: "Recipient email address",
          },
          subject: {
            type: "string",
            description: "Email subject line",
          },
          body: {
            type: "string",
            description: "Plain text email body",
          },
          html: {
            type: "string",
            description: "Optional HTML email body (takes priority over plain text for display)",
          },
          attachments: {
            type: "array",
            items: { type: "string" },
            description: "Optional array of absolute file paths to attach",
          },
        },
        required: ["to", "subject", "body"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "send_email") {
    return {
      content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
      isError: true,
    };
  }

  const { to, subject, body, html, attachments } = request.params.arguments;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return {
      content: [
        {
          type: "text",
          text: "Error: GMAIL_USER and GMAIL_APP_PASSWORD environment variables must be set.",
        },
      ],
      isError: true,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });

    const mailAttachments = [];
    if (attachments && Array.isArray(attachments)) {
      for (const filePath of attachments) {
        const content = await readFile(filePath);
        mailAttachments.push({
          filename: basename(filePath),
          content,
        });
      }
    }

    const info = await transporter.sendMail({
      from: GMAIL_USER,
      to,
      subject,
      text: body,
      html: html || undefined,
      attachments: mailAttachments,
    });

    return {
      content: [
        {
          type: "text",
          text: `Email sent successfully!\nMessage ID: ${info.messageId}\nTo: ${to}\nSubject: ${subject}${mailAttachments.length ? `\nAttachments: ${mailAttachments.map((a) => a.filename).join(", ")}` : ""}`,
        },
      ],
    };
  } catch (err) {
    return {
      content: [{ type: "text", text: `Failed to send email: ${err.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("MCP email server error:", err);
  process.exit(1);
});
