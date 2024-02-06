import { GetServerSideProps } from "next";
import Head from "next/head";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./styles.module.css";

import { getSession } from "next-auth/react";
import { FaTrash } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

import { Textarea } from "@/components/text-area";
import Link from "next/link";


interface DashboardProps {
  user: {
    email: string;
  };
}

interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  task: string;
  user: string;
}

export default function Dashboard({ user }: DashboardProps) {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  async function loadTasks() {
      
    const taskListResponse = await fetch("/api/task", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("Tasks are", await taskListResponse.json())
    const taskList = await taskListResponse.json()
    // // console.log(result)
    setTasks(taskList);
  
  }

  useEffect(() => {
    loadTasks();
  }, [user?.email]);

  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
    console.log("Tasks are", tasks)
  }

  async function handleRegisterTask(event: FormEvent) {
    event.preventDefault();

    if (input === "") return;

    try {

      const data = {
        task: input,
        created: new Date(),
        user: user?.email,
        public: publicTask,
      };

      await fetch("/api/task", {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			});
      
      setInput("");
      setPublicTask(false);
      loadTasks();
    } catch (err) {
      console.log(err);
    }
  }

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_AUTH_URL}/task/${id}`
    );
    console.log("URL", process.env.NEXT_AUTH_URL)
    alert("URL Copied!");
  }

  async function handleDeleteTask(id: string) {
    await fetch("/api/task", {
      method: "DELETE",
      body:JSON.stringify({id}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    loadTasks();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>My Task Board</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>What is your task?</h1>

            <form onSubmit={handleRegisterTask}>
              <Textarea
                placeholder="Define your task here..."
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(event.target.value)
                }
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label>Is it Public?</label>
              </div>

              <button className={styles.button} type="submit">
                Submit
              </button>
            </form>
          </div>
        </section>
        
        <section className={styles.taskContainer}>
          <h1>My Tasks</h1>

          {tasks.map((item) => (
            <article key={item.id} className={styles.task}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PUBLIC</label>
                  <button className={styles.shareButton}
                    onClick={() => handleShare(item.id)}>
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>
                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.task}</p>
                  </Link>
                ) : (
                  <p>{item.task}</p>
                )}

                <button
                  className={styles.trashButton}
                  onClick={() => handleDeleteTask(item.id)}
                >
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  // console.log(session);

  if (!session?.user) {
    // Se nao tem usuario vamos redirecionar para  /
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
};
