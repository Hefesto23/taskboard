import styles from "@/styles/Home.module.css";
import Head from "next/head";
import Image from 'next/image';

import logoHome from "../../public/assets/hero.png";


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>
      
      <main className={styles.main}>
        <div className={styles.logoHome}>
          <Image
          className={styles.hero}
          alt="Logo Tarefas+"
          src={logoHome}
          priority
          />
        </div>
        <h1 className={styles.title}>System made to <br/> organize your tasks</h1>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+12 posts</span>
          </section>
          <section className={styles.box}>
            <span>+90 comments</span>
          </section>
        </div>
      </main>
    </div>
  );
}
