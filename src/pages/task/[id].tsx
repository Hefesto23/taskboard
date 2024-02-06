import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./styles.module.css";


import { Textarea } from "@/components/text-area";
import { FaTrash } from "react-icons/fa";

interface TaskProps {
  item: {
    task: string;
    created: string;
    public: boolean;
    user: string;
    id: string;
  };
  allComments: CommentProps[];
}

interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

export default function Task({ item, allComments }: TaskProps) {
  const { data: session } = useSession();

  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentProps[]>(allComments || []);

  async function handleComment(event: FormEvent) {
    event.preventDefault();

    if (input === "") return;

    if (!session?.user?.email || !session?.user?.name) return;

    try {

        const data = {
            comment: input,
            created: new Date(),
            user: session?.user?.email,
            name: session?.user?.name,
            taskId: item?.id,
          };
    
        const comment = await fetch(`${process.env.NEXT_AUTH_URL}/api/comment`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

       const com1 = await comment.json()

        console.log(com1)

    //   const data2 = {
    //     id: comment.id,
    //     comment: input,
    //     user: session?.user?.email,
    //     name: session?.user?.name,
    //     taskId: item?.taskId,
    //   };

      setComments((oldItems) => [...oldItems, com1]);
      setInput("");
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteComment(id: string) {
    try {
        await fetch("/api/comment", {
            method: "DELETE",
            body:JSON.stringify({id}),
            headers: {
              "Content-Type": "application/json",
            },
        });

      const deleteComment = comments.filter((item) => item.id !== id);

      setComments(deleteComment);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Task - Details</title>
      </Head>

      <main className={styles.main}>
        <h1>Task</h1>
        <article className={styles.task}>
          <p>{item.task}</p>
        </article>
      </main>

      <section className={styles.commentsContainer}>
        <h2>Leave Comment</h2>

        <form onSubmit={handleComment}>
          <Textarea
            value={input}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(event.target.value)
            }
            placeholder="Type your comment..."
          />
          <button disabled={!session?.user} className={styles.button}>
            Submit
          </button>
        </form>
      </section>

      <section className={styles.commentsContainer}>
        <h2>Comments</h2>
        {comments.length === 0 && (
          <span>No comment found...</span>
        )}

        {comments.map((item) => (
          <article key={item.id} className={styles.comment}>
            <div className={styles.headComment}>
              <label className={styles.commentsLabel}>{item.name}</label>
              {item.user === session?.user?.email && (
                <button
                  className={styles.buttonTrash}
                  onClick={() => handleDeleteComment(item.id)}
                >
                  <FaTrash size={18} color="#EA3140" />
                </button>
              )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const getTask = await fetch(`${process.env.NEXT_AUTH_URL}/api/task?id=${id}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

   const task = await getTask.json()

  const getComments = await fetch(`${process.env.NEXT_AUTH_URL}/api/comment?taskId=${id}`, 
    {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

  let allComments: CommentProps[] = await getComments.json();


  if (getComments === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      item: task,
      allComments: allComments,
    },
  };
};
