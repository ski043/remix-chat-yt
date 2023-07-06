import { ActionArgs, LoaderArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useEventSource } from "remix-utils";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";
import { emitter } from "~/services/emitter.server";

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const data = await db.message.findMany({
    select: {
      message: true,
      id: true,
      User: {
        select: {
          username: true,
          imageUrl: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
    take: 50,
  });

  return json({ data });
}

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const formData = await request.formData();
  const message = formData.get("message");

  try {
    const data = await db.message.create({
      data: {
        message: message as string,
        userId: user.id,
      },
      include: {
        User: {
          select: {
            username: true,
            imageUrl: true,
          },
        },
      },
    });

    emitter.emit("message", `${JSON.stringify(data)}\n\n`);
    return json(null, { status: 201 });
  } catch (error) {
    throw error;
  }
}

export default function Chat() {
  const { data } = useLoaderData<typeof loader>();
  const [totalComments, setTotalComments] = useState(data);

  const currentComments = useEventSource("/chat/subscribe", {
    event: "message",
  });

  const messageEndRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const parsedComments = JSON.parse(currentComments as string);
    if (parsedComments !== null) {
      setTotalComments((prev) => [...prev, parsedComments]);
    }
  }, [currentComments]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [totalComments]);

  return (
    <div className="h-screen bg-gray-200 flex flex-col">
      <div className="p-6 flex-grow max-h-screen overflow-y-auto py-32">
        <div className="flex flex-col gap-4">
          {totalComments.map((message, index) => (
            <div key={index}>
              <div className="flex items-center">
                <img
                  src={message.User?.imageUrl}
                  alt="Profile image of user"
                  className="h-12 w-12 object-cover rounded-lg mr-4"
                />
                <div className="rounded-lg bg-white p-4 shadow-md self-start">
                  {message.message}
                </div>
              </div>
              <p className="font-light text-sm text-gray-600">
                {message.User?.username}
              </p>
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
      </div>

      <Form method="POST" className="p-6 fixed bottom-0 left-0 w-full bg-white">
        <div className="flex">
          <input
            type="text"
            name="message"
            placeholder="Type your mesage..."
            className="flex-grow py-2 px-4 outline-none"
          />
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg"
          >
            Send
          </button>
        </div>
      </Form>
    </div>
  );
}
